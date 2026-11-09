declare const Netlify: {
  readonly env: {
    get(name: string): string | undefined;
  };
};
