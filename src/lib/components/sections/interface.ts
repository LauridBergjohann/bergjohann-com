/**
 * Base properties shared by all section types.
 */
export type SectionBase = {
  /**
   * Unique identifier for the section.
   */
  id: string;

  /**
   * Optional section title.
   */
  title?: string;

  /**
   * Maximum content width used by the section.
   *
   * @defaultValue `"wide"`
   */
  layout?: "full" | "wide" | "narrow";

  /**
   * Background style of the section.
   *
   * @defaultValue `"normal"`
   */
  background?: "normal" | "muted" | "transparent";

  /**
   * Vertical spacing applied inside the section.
   *
   * @defaultValue `"normal"`
   */
  spacing?: "none" | "tight" | "normal" | "loose";

  /**
   * Divider line displayed above, below, or on both sides of the section.
   *
   * @defaultValue `"none"`
   */
  divider?: "none" | "top" | "bottom" | "both";
};

/**
 * Represents a navigational card displayed inside a list section.
 */
export type Card = {
  /**
   * Unique identifier for the card.
   */
  id: string;

  /**
   * Navigation target of the card.
   *
   * May point to an internal application route or an external URL.
   */
  href: string;

  /**
   * Primary title displayed on the card.
   */
  title: string;

  /**
   * Optional secondary text displayed below the title.
   */
  subtitle?: string;

  /**
   * Optional image displayed on the card.
   */
  image?: string;

  /**
   * Determines whether the image should fill its available area using a
   * cover-style crop.
   *
   * @defaultValue `false`
   */
  imageCover?: boolean;
};

/**
 * Section that displays a collection of cards.
 */
export type ListSection = SectionBase & {
  /**
   * Cards displayed inside the section.
   */
  cards: Card[];

  /**
   * Visual size of the cards.
   *
   * @defaultValue `"md"`
   */
  cardSize?: "sm" | "md" | "lg";
};

export type ListSectionTyped = ListSection & {
  /**
   * Discriminator identifying this section as a list section.
   */
  type: "list";
};

/**
 * Section displaying a large hero image with optional overlay content.
 */
export type HeroImageSection = SectionBase & {
  /**
   * Hero image configuration.
   */
  image: {
    /**
     * Image source URL or application-relative path.
     */
    src: string;

    /**
     * Alternative text describing the image.
     */
    alt: string;
  };

  /**
   * Optional headline displayed as an overlay on the hero image.
   */
  headline?: string;

  /**
   * Horizontal alignment of the headline overlay.
   *
   * @defaultValue `"right"`
   */
  headlineAlign?: "left" | "center" | "right";

  /**
   * Height of the hero image.
   *
   * @defaultValue `"md"`
   */
  size?: "sm" | "md" | "lg";
};

export type HeroImageSectionTyped = HeroImageSection & {
  /**
   * Discriminator identifying this section as a hero image section.
   */
  type: "heroImage";
};

/**
 * Supported aspect ratios for section images.
 *
 * `"none"` disables enforced aspect-ratio handling.
 */
export type ImageAspect = "none" | "4/3" | "16/9" | "2/1" | "square";

/**
 * Section combining an image with optional textual content.
 */
export type ImageSection = SectionBase & {
  /**
   * Image configuration.
   */
  image: {
    /**
     * Image source URL or application-relative path.
     */
    src: string;

    /**
     * Alternative text describing the image.
     */
    alt: string;

    /**
     * Aspect ratio applied to the image container.
     */
    aspect?: ImageAspect;

    /**
     * Determines how the image is fitted inside its container.
     *
     * @defaultValue `"cover"`
     */
    objectFit?: "cover" | "contain";
  };

  /**
   * Optional headline displayed alongside the image.
   */
  headline?: string;

  /**
   * Optional descriptive text displayed alongside the image.
   */
  description?: string;

  /**
   * Side on which the image is displayed relative to the text content.
   *
   * @defaultValue `"left"`
   */
  imageSide?: "left" | "right";
};

export type ImageSectionTyped = ImageSection & {
  /**
   * Discriminator identifying this section as an image section.
   */
  type: "image";
};

/**
 * Section combining video content with optional textual content.
 */
export type VideoSection = SectionBase & {
  /**
   * Video configuration.
   */
  video: {
    /**
     * Video source.
     *
     * For HTML5 video this is typically a media file URL.
     * For YouTube this may represent the corresponding video URL or identifier,
     * depending on how the renderer handles the provider.
     */
    src: string;

    /**
     * Optional poster image shown before playback starts.
     */
    poster?: string;

    /**
     * Video provider used to render the source.
     */
    provider: "html5" | "youtube";
  };

  /**
   * Optional headline displayed alongside the video.
   */
  headline?: string;

  /**
   * Optional descriptive text displayed alongside the video.
   */
  description?: string;

  /**
   * Side on which the video is displayed relative to the text content.
   *
   * @defaultValue `"left"`
   */
  videoSide?: "left" | "right";
};

export type VideoSectionTyped = VideoSection & {
  /**
   * Discriminator identifying this section as a video section.
   */
  type: "video";
};

/**
 * Section for displaying formatted or plain textual content.
 */
export type RichTextSection = SectionBase & {
  /**
   * Raw textual content of the section.
   */
  body: string;

  /**
   * Format used to interpret the body content.
   *
   * @defaultValue `"markdown"`
   */
  format?: "markdown" | "text";
};

export type RichTextSectionTyped = RichTextSection & {
  /**
   * Discriminator identifying this section as a rich text section.
   */
  type: "richText";
};

/**
 * Union of all supported section types.
 *
 * The `type` property acts as the discriminator for narrowing
 * the concrete section type.
 */
export type Section =
  | HeroImageSectionTyped
  | RichTextSectionTyped
  | ListSectionTyped
  | VideoSectionTyped
  | ImageSectionTyped;