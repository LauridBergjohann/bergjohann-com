export type Model = {
	id: string;
	name: string;
	image: string;
  geometry?: string;
	description?: string;
  media?: MediaElements;
	usps?: Usps;
};

/**
 * Type representing an array of media elements, which can be either images or later also videos.
 */
export type MediaElements = MediaElement[];

/** Type representing either an image media element.
 */
export type MediaElement = Image | Video;

/** Type representing an image with a URL and an optional alt text. */
export type Image = {
    type: MediaType.image;
    src: string;
    alt: string;
}

export type Video = {
    type: MediaType.video;
    src: string;
    poster: string;
    alt: string;
}

export enum MediaType{
    image='image',
    video='video'
}

// USPS

export type Usps = Usp[];

export type Usp = {
	icon: string;
	label: string;
}
