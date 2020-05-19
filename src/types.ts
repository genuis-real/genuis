export interface GeniusSongResponse {
    id: number;
    title: string;
    song_art_image_thumbnail_url?: string;
    primary_artist: {
        name: string;
    };
}
