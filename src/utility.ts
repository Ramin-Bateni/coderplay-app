import { BrowserWindow, screen } from 'electron';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import url from 'url';
import {
    IAssetFlow,
    ILoadedSolution,
    IProject,
    IReference,
    ISolutionTree,
    ISolutionTreeItem,
} from './components/CoderplaySolutionTypes';

// interface ISolutionTree{
//     // ISolTreeItems[]
// }

// interface ISolTreeItems{
// {
//     name:string,
//     // children: [
//     //     {
//     //         name: 'static',
//     //         children: [
//     //             {
//     //                 name: 'logo.png',
//     //                 file: 'png',
//     //             },
//     //         ],
//     //     },
// }
interface IGroupedRefItem {
    path: string;
    references: IReference[];
    // type: 'directory' | 'file';
}

interface IUtility {
    GetIconClassFromFileType(type: string): string;
    /** Check the file is exisst on the disk or not */
    fileIsExists(path: string): Promise<boolean>;

    /* Make the file URL from the assetItemFlow object */
    AssetFlow2Url(assetItemFlow: IAssetFlow): string;

    /** Limit the text length and insert "…" character at the end
     * also this method try to dose not put the "…" character between a word
     * or after a punctuation symbol [. , ;]
     */
    limitText(text: string, limit: number, tail?: string | '…'): string;

    windowIsMaximized(window: BrowserWindow): boolean;

    GenerateSolTree(sol: ILoadedSolution): ISolutionTree;

    groupReferencesByPath(refs: IReference[]): IGroupedRefItem[];

    fillTree(tree: ISolutionTree, groupedRef: IGroupedRefItem): ISolutionTree;
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

    GetIconClassFromFileType(fileType: string): string {
        if (fileType.indexOf('video') > -1) {
            return 'local_movies';
        }
        if (fileType.indexOf('audio') > -1) {
            return 'music_note';
        }
        return 'insert_drive_file';
    },

    /** Limit the text length and insert "…" character at the end
     * also this method try to dose not put the "…" character between a word
     * or after a punctuation symbol [. , ;]
     */
    limitText(text: string, limit: number, tail?: string | '…'): string {
        // debugger
        if (!tail) {
            tail = '…';
        }
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

    AssetFlow2Url(assetItemFlow: IAssetFlow): string {
        const dir = path.dirname(assetItemFlow.solution.meta.filePath);
        const filePath = path.join(
            dir,
            'assets',
            assetItemFlow.project.id,
            assetItemFlow.reference.id,
            assetItemFlow.assetItem.id +
                '.' +
                assetItemFlow.assetItem.asset().file.ext
        );
        const fileUrl = url.pathToFileURL(filePath).toString();
        // debugger
        return fileUrl;
    },

    windowIsMaximized(window: BrowserWindow): boolean {
        const wBound = window.getBounds();
        const screenSize = screen.getPrimaryDisplay().workAreaSize;
        const isMaximized =
            wBound.height === screenSize.height &&
            wBound.width === screenSize.width &&
            wBound.x === 0 &&
            wBound.y === 0;
        return isMaximized;
    },

    GenerateSolTree(sol: ILoadedSolution): ISolutionTree {
        if (!sol || !Array.isArray(sol.projects)) {
            return [];
        }
        //  debugger;
        const tree: ISolutionTree = [];

        for (const proj of sol.projects as IProject[]) {
            const projTreeItem: ISolutionTreeItem = {
                id: proj.id,
                title: proj.title,
                type: 'project',
            };

            // console.log(this.groupReferencesByPath(proj.references));
            const groupReferencesByPath = this.groupReferencesByPath(
                proj.references
            );
            console.log('groupReferencesByPath', groupReferencesByPath);

            groupReferencesByPath.forEach(groupedRef => {
                // if (
                //     projTreeItem.type === 'project' ||
                //     projTreeItem.type === 'directory'
                // ) {
                if (projTreeItem.children === undefined) {
                    projTreeItem.children = [];
                }
                console.log(
                    'fillTree » projTreeItem.children',
                    projTreeItem.children
                );
                console.log('fillTree » groupedRef', groupedRef);

                projTreeItem.children = this.fillTree(
                    projTreeItem.children,
                    groupedRef
                );
                console.log('projTreeItem.children', projTreeItem.children);
                // debugger;
                // projTreeItem.children = item.references.map(
                //     (ref: IReference) => {
                //         const refTreeItem: ISolutionTreeItem = {
                //             id: ref.id,
                //             title: ref.title,
                //             path: item.path,
                //             type: item.type, // 'reference',
                //         } as ISolutionTreeItem;
                //         return refTreeItem;
                //     }
                // );
                // }
            });

            tree.push(projTreeItem);
        }

        console.log('tree', tree);

        return tree;
    },

    fillTree(tree: ISolutionTree, groupedRef: IGroupedRefItem): ISolutionTree {
        const pathParts = groupedRef.path.replace(/^\/|\/$/g, '').split('/');

        let localTree;
        let parent;
        let isExistInTree = false;
        for (let i = 0; i < pathParts.length; i++) {
            const pathPart = pathParts[i];
            const newNode: ISolutionTreeItem = {
                title: pathPart,
                type: 'directory',
                path: pathParts.slice(0, i + 1).join('/'),
                children: [],
            };

            let existNode;

            if (i === 0) {
                existNode = tree.find(item => {
                    return item.path === pathPart;
                });
            }
            if (existNode) {
                localTree = existNode;
                isExistInTree = true;
                continue;
            }

            // If isFile
            if (i === pathParts.length - 1) {
                // node.size = obj.size;
                // node.type = obj.type;
                newNode.type = 'file';
                newNode.children = groupedRef.references.map(r => {
                    return {
                        title: r.title,
                        type: 'reference',
                        path: groupedRef.path,
                        id: r.id,
                        childrenCount: r.assetItems.length,
                        // children: r.assetItems.map(asset => {
                        //     return {
                        //         title: asset.asset().title,
                        //         type: 'asset',
                        //         id: asset.id,
                        //     } as ISolutionTreeItem;
                        // }),
                    } as ISolutionTreeItem;
                });
            }
            if (localTree === undefined) {
                localTree = newNode;
            } else {
                if (!localTree.children) {
                    localTree.children = [];
                }
                if (!parent) {
                    parent = localTree;
                }
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(newNode);
                parent = parent.children[localTree.children.length - 1];
            }
        }
        if (localTree && !isExistInTree) {
            tree.push(localTree);
        }
        return tree;
    },
    // unionListOfFilePathsOfProject(proj: IProject): string[] {
    //     const list: string[] = [];
    //     proj.references.forEach(ref => {
    //         lodash.union(...list, ref.filePaths);
    //     });

    //     list;
    // },

    // addNode(ref: IReference) {
    //     const tree = {};
    //     const splitPath = ref.path.replace(/^\/|\/$/g, '').split('/');

    //     for (let i = 0; i < splitPath.length; i++) {
    //         const path = splitPath[i];
    //         const node = { name: path, type: 'directory' };
    //         if (i === splitPath.length - 1) {
    //             node.size = obj.size;
    //             node.type = obj.type;
    //         }
    //         tree[path] = tree[path] || node;
    //         tree[path].children = tree[path].children || {};
    //         tree = tree[path].children;
    //     }

    //     return tree;
    // },
    // addNodeBayPath(path: string) {
    //     const tree = {};
    //     const node = { name: path, type: 'directory' };
    //     if (i === splitPath.length - 1) {
    //         node.size = obj.size;
    //         node.type = obj.type;
    //     }
    //     tree[path] = tree[path] || node;
    //     tree[path].children = tree[path].children || {};
    //     tree = tree[path].children;
    //     return tree;
    // },

    groupReferencesByPath(refs: IReference[]): IGroupedRefItem[] {
        let list: string[] = [];

        // debugger;
        console.log('refs', refs);

        if (!refs) {
            return [];
        }
        // Fill list
        refs.forEach(ref => {
            list = _.union(list, ref.filePaths);
            // list = ref.filePaths;
        });

        // Sort
        list = _.sortBy(list);
        // Create finalList
        const finalList = list.map((filePath: string) => {
            const result: IGroupedRefItem = {
                path: '',
                references: [],
                // type: 'directory',
            };

            refs.filter(ref => {
                return ref.filePaths.includes(filePath);
            }).forEach(ref => {
                result.path = filePath;
                result.references.push(ref);
            });

            return result;
        });

        return finalList;
        // Create tree
        // dict.map(this.addNode);
        // console.log(require('util').inspect(tree, { depth: null }));
    },
};

export { Utility };
