import type { VerbForm } from '../domain/content/v2';

export function VerbFormsDetails({ item }: { item: VerbForm }) {
  const form = item.properties;
  return <>
    <dl className="rule verb-form-grid">
      <div><dt>Infinitiv</dt><dd lang="de">{form.infinitive}</dd></div>
      <div><dt>Präsens · er/sie/es</dt><dd lang="de">{form.present3}</dd></div>
      <div><dt>Präteritum · ich</dt><dd lang="de">{form.praeteritum}</dd></div>
      <div><dt>Partizip II</dt><dd lang="de">{form.participle}</dd></div>
      <div><dt>Hilfsverb · in this context</dt><dd lang="de">{form.auxiliary}</dd></div>
      <div><dt>Classification / separability</dt><dd>{form.classification} · {form.separability}</dd></div>
      {form.stemChange && <div><dt>Present stem change</dt><dd lang="de">{form.stemChange.from} → {form.stemChange.to}</dd></div>}
    </dl>
    <p className="muted">{form.auxiliaryNote}</p>
    <p className="muted">{item.level ?? 'Unassigned'} · editorial prerequisite estimate. {item.register} register.</p>
  </>;
}
