export const parseCaption = (caption) => {
  // accepts text have format: #[text] / #[text]-[text] / #[text]_[text]
  const hashtags = caption.match(/(#[a-z\d-_]+)/gi) || [];

  return hashtags;
};
