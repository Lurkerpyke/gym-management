// src/types/pdfmake.d.ts
declare module 'pdfmake/build/pdfmake' {
    import { TDocumentDefinitions } from 'pdfmake/interfaces';

    interface PdfMake {
        createPdf(documentDefinition: TDocumentDefinitions): {
            download(filename?: string): void;
            open(): void;
            print(): void;
        };
        vfs: Record<string, string>;
        fonts: Record<string, unknown>;
    }

    const pdfmake: PdfMake;
    export default pdfmake;
}

declare module 'pdfmake/build/vfs_fonts' {
    const vfs: Record<string, string>;
    export default vfs;
}