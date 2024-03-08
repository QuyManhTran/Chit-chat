export enum MessageType {
    AUDIO = 'audio',
    TEXT = 'text',
    PHOTO = 'image',
    DOCUMENT = 'pdf',
    APPLICATION = 'application',
}

export enum Attachment {
    MAX_SIZE = 5 * 1024 * 2024,
}

export enum Call {
    AUDIO = 'audio',
    VIDEO = 'video',
}
