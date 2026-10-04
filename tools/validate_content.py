#!/usr/bin/env python3
"""Validate starter content with Python's standard library.

Supports exactly the JSON Schema keywords used in this pack, and rejects
unknown keywords instead of silently ignoring them. Not a general schema engine.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path


def require(condition, message):
    if not condition:
        raise ValueError(message)


def validate(value, schema, path='$'):
    supported = {'$schema', '$id', 'title', 'type', 'const', 'enum', 'oneOf',
                 'properties', 'required', 'additionalProperties', 'minLength',
                 'pattern', 'minimum', 'minItems', 'items', 'uniqueItems'}
    require(set(schema) <= supported, f'{path}: unsupported schema keyword')
    if 'oneOf' in schema:
        matches = 0
        for option in schema['oneOf']:
            try:
                validate(value, option, path)
                matches += 1
            except ValueError:
                pass
        require(matches == 1, f'{path}: must match exactly one question variant')
    if 'const' in schema:
        require(type(value) is type(schema['const']) and value == schema['const'], f'{path}: invalid constant')
    if 'enum' in schema:
        require(any(type(value) is type(v) and value == v for v in schema['enum']), f'{path}: invalid enum')
    if 'type' in schema:
        types = schema['type'] if isinstance(schema['type'], list) else [schema['type']]
        checks = {'object': isinstance(value, dict), 'array': isinstance(value, list),
                  'string': isinstance(value, str), 'integer': type(value) is int,
                  'null': value is None}
        require(any(checks.get(t, False) for t in types), f'{path}: invalid type')
    if isinstance(value, dict):
        require(set(schema.get('required', [])) <= set(value), f'{path}: missing required field')
        props = schema.get('properties', {})
        if schema.get('additionalProperties') is False:
            require(set(value) <= set(props), f'{path}: unexpected field')
        for key, item in value.items():
            if key in props:
                validate(item, props[key], f'{path}.{key}')
    if isinstance(value, list):
        require(len(value) >= schema.get('minItems', 0), f'{path}: too few items')
        if schema.get('uniqueItems'):
            encoded = [json.dumps(v, sort_keys=True, ensure_ascii=False) for v in value]
            require(len(set(encoded)) == len(encoded), f'{path}: duplicate item')
        if 'items' in schema:
            for i, item in enumerate(value):
                validate(item, schema['items'], f'{path}[{i}]')
    if isinstance(value, str):
        require(len(value) >= schema.get('minLength', 0) and bool(value.strip()), f'{path}: blank text')
        if 'pattern' in schema:
            require(re.search(schema['pattern'], value) is not None, f'{path}: invalid pattern')
    if type(value) is int and 'minimum' in schema:
        require(value >= schema['minimum'], f'{path}: below minimum')


def normalize(text):
    return ' '.join(unicodedata.normalize('NFC', text).strip().lower().split())


def indexed(items, label):
    out = {item['id']: item for item in items}
    require(len(out) == len(items), f'{label}: duplicate ID')
    return out


def check(pack, schema):
    validate(pack, schema)
    entries = indexed(pack['entries'], 'entries')
    questions = indexed(pack['questions'], 'questions')
    indexed(pack['blocks'], 'blocks')
    example_ids = []
    for entry in entries.values():
        examples = indexed(entry['examples'], entry['id'])
        example_ids.extend(examples)
        require({'everyday', 'technical'} <= {x['domain'] for x in examples.values()}, f"{entry['id']}: needs both example domains")
    require(len(set(example_ids)) == len(example_ids), 'example IDs must be globally unique')
    for q in questions.values():
        require(q['entryId'] in entries, f"{q['id']}: unknown entry")
        entry = entries[q['entryId']]
        examples = {x['id']: x for x in entry['examples']}
        require(q['exampleId'] is None or q['exampleId'] in examples, f"{q['id']}: unknown example")
        if q['type'] == 'preposition_cloze':
            require(q['exampleId'] is not None and q['prompt'].count('___') == 1, f"{q['id']}: cloze needs one blank and example")
            normalized = [normalize(x) for x in q['acceptedAnswers']]
            require(len(set(normalized)) == len(normalized), f"{q['id']}: equivalent duplicate answers")
            require(normalize(entry['preposition']) in normalized, f"{q['id']}: expected preposition missing")
            restored = q['prompt'].replace('___', entry['preposition'])
            require(restored == examples[q['exampleId']]['de'], f"{q['id']}: cloze does not reconstruct example")
        else:
            choices = indexed(q['choices'], q['id'])
            require(q['correctChoiceId'] in choices, f"{q['id']}: correct choice missing")
            require(len({normalize(c['text']) for c in choices.values()}) == len(choices), f"{q['id']}: duplicate choice text")
            if q['type'] == 'case_choice':
                require(q['correctChoiceId'] == entry['governedCase'], f"{q['id']}: case mismatch")
    covered = set()
    for block in pack['blocks']:
        for qid in block['questionIds']:
            require(qid in questions, f"{block['id']}: unknown question {qid}")
            covered.add(qid)
    require(covered == set(questions), 'every question must belong to a block')
    require({q['entryId'] for q in questions.values()} == set(entries), 'every entry needs questions')
    return len(entries), len(questions), len(pack['blocks'])


def main():
    root = Path(__file__).resolve().parents[1]
    pack_path = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'content/seed-pack.json'
    try:
        pack = json.loads(pack_path.read_text(encoding='utf-8'))
        schema = json.loads((root / 'content/content.schema.json').read_text(encoding='utf-8'))
        counts = check(pack, schema)
        print(f'PASS: {counts[0]} entries, {counts[1]} questions, {counts[2]} blocks; structure and references valid.')
    except (OSError, ValueError, KeyError) as exc:
        print(f'FAIL: {exc}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
