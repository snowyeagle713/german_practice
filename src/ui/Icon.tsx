const paths = {
  home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  blocks: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  progress: 'M4 20V10m8 10V4m8 16v-7',
  settings: 'M4 7h16M4 17h16M9 4v6m6 4v6',
  book: 'M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-2-1-6-2-10 1Z',
  leaf: 'M5 19C2 9 9 3 21 3c0 12-6 19-16 16Zm0 0L16 8',
} as const;

export function Icon({ name }: { name: keyof typeof paths }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
