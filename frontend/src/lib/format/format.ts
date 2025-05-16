function formatString(raw: string, pattern: string): string {
  let new_str = '';
  let offset = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern.charAt(i) === 'x')
      new_str += raw.charAt(i - offset) ? raw.charAt(i - offset) : '';
    else {
      new_str += pattern.charAt(i);
      offset++;
    }
  }

  return new_str;
}

export { formatString };
