import { BaseEntityRecordType } from './base-entity-record';
export interface BaseMusicMediaDocRecordType extends BaseEntityRecordType {
    name: string;
    album: string;
    albumArtist: string;
    albumGenre: string;
    artist: string;
    genre: string;
    trackNo: number;
}
export interface BaseMusicMediaDocRecordReferencesType extends BaseEntityRecordType {
    albumId: number;
    audioId: number;
    artistId: number;
    genreId: number;
}
