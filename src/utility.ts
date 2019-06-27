import fs from 'fs';
import path from 'path';
import url from 'url';
import { IAssetFlow } from './components/CoderplaySolutionTypes';

interface IUtility {
    /** Check the file is exisst on the disk or not */
    fileIsExists(path: string): Promise<boolean>;
    /* Make the file URL from the assetFlow object */
    AssetFlow2Url(assetFlow: IAssetFlow): string;
    /** Limit the text length and insert "…" character at the end
     * also this method try to dose not put the "…" character between a word
     * or after a punctuation symbol [. , ;]
     */
    limitText(text: string, limit: number, tail?: string | '…'): string;
}

const Utility: IUtility = {
    /** Check the file is exisst on the disk or not */
    async fileIsExists(strPath: string): Promise<boolean> {
        try {
            await fs.promises.access(strPath);
            return true;
        } catch (error) {
            return false;
        }
    },

    /** Limit the text length and insert "…" character at the end
     * also this method try to dose not put the "…" character between a word
     * or after a punctuation symbol [. , ;]
     */
    limitText(text: string, limit: number, tail?: string | '…'): string {
        // debugger
        if (text && text.length > limit) {
            for (let i = limit; i > 0; i--) {
                if (
                    text.charAt(i) === ' ' &&
                    (text.charAt(i - 1) !== ',' ||
                        text.charAt(i - 1) !== '.' ||
                        text.charAt(i - 1) !== ';')
                ) {
                    return text.substring(0, i) + tail;
                }
            }
            return text.substring(0, limit) + tail;
        } else {
            return text === undefined ? '' : text;
        }
    },

    AssetFlow2Url(assetFlow: IAssetFlow): string {
        const dir = path.dirname(assetFlow.solution.meta.filePath);
        const filePath = path.join(
            dir,
            'assets',
            assetFlow.project.id,
            assetFlow.reference.id,
            assetFlow.asset.id + '.' + assetFlow.asset.file.ext
        );
        const fileUrl = url.pathToFileURL(filePath).toString();
        // debugger
        return fileUrl;
    },
};

export { Utility };
