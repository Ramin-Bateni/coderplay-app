export interface IAssetFile {
    type: string;
    ext: string;
    textsOfMedia: string[];
    subtitles: string[];
}
export interface IAsset {
    id: string;
    title: string;
    desc: string;
    createdOn: Date;
    updatedOn: Date;
    file: IAssetFile;
}
export interface IAssetItem {
    id: string;
    priority: number;
    isSelected: boolean;
    asset(): IAsset;
}

export interface IReference {
    id: string;
    title: string;
    desc: string;
    filePaths: string[];
    createdOn: Date;
    updatedOn: Date;
    isSelected: boolean;
    assetItems: IAssetItem[];
}
export interface IProject {
    id: string;
    title: string;
    desc: string;
    isSelected: boolean;
    assets: IAsset[];
    references: IReference[];
    config: IProjectConfig;
}

export interface IProjectConfig {
    videoRecording: IVideoRecordingConfig;
    audioRecording: IAudioRecordingConfig;
    recordingMimeType: 'video/webm;codecs=vp9' | 'video/webm;codecs=h264';
}

export interface IAudioRecordingConfig {
    audioBitsPerSecond?: number; //  128000;
}

export interface IVideoRecordingConfig {
    overlays: Array<IDesktopOverlay | IPhotoOverlay | IWebcamOverlay>;
    videoBitsPerSecond?: number; // 128000;
    timeSlice?: number; // 2000;
    bitsPerSecond?: number; // 128000;
}

export interface IWebcamOverlay extends ICaptureOverlay {
    name: 'webcam';
}

export interface IPhotoOverlay extends ICaptureOverlay {
    name: 'photo';
}

export interface IDesktopOverlay extends ICaptureOverlay {
    name: 'desktop';
}

export interface ICaptureOverlay {
    id: string;
    isShown: boolean;
    position: ICaptureOverlayPosition;
    size: ICaptureOverlaySize;
}

export interface ICaptureOverlaySize {
    width: number;
    height: number;
}

export interface ICaptureOverlayPosition {
    place: 'fill' | 'tl' | 'tr' | 'bl' | 'br';
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
}

export interface ISolution {
    generator: string;
    version: string;
    title: string;
    desc: string;
    createdOn: Date;
    updatedOn: Date;
    projects: IProject[];
}

export interface IPrimaryDrawer {
    model: boolean;
    type: '' | 'permanent' | 'temporary';
    clipped: boolean;
    floating: boolean;
    mini: boolean;
}

export interface IResourceFlow {
    solution: ILoadedSolution | undefined;
    project: IProject | undefined;
    reference: IReference | undefined;
    assetItem: IAssetItem | undefined;
}
export interface IAssetFlow {
    solution: ILoadedSolution;
    project: IProject;
    reference: IReference;
    assetItem: IAssetItem;
}

export interface IReferenceFlow {
    solution: ILoadedSolution;
    project: IProject;
    reference: IReference;
}

export interface IProjectFlow {
    solution: ILoadedSolution;
    project: IProject;
}

export interface ISolutionFlow {
    solution: ILoadedSolution;
}

export interface ISolutionMeta {
    /**
     * the loadId is a dynamic GUID and will be filled onec when the solution opened in the application
     */
    loadId: string;

    /*  a snapshot of the loaded/saved solution.
     *  this property will be updated after each time the solution file will be saved
     */
    lastSavedSnapshot: ISolution;

    /**
     * this property will be filled after first loading and
     * will be updated after each time that the solution file will be saved
     */
    lastSavedOn: Date;

    /** should be updated adter each change in solution object */
    isModified: boolean;

    /** the solution file path  */
    filePath: string;

    /** if the solution is seleceted (is current solution) */
    isSelected: boolean;
}

export interface ILoadedSolution extends ISolution {
    meta: ISolutionMeta;
}
export interface IPlayer {
    fullscreen: boolean;
    picInPic: boolean;
    autoplay: boolean;
    controlesVisibility: boolean;
    fileType: string;
    poster: string;
    url: string;
}
export interface IPlayInfo {
    player: IPlayer;
    assetIsSelected: boolean;
    assetIsMedia: boolean;
    title: string;
    description: string;
}
export interface IRecordInfo {
    player: IPlayer;
    title: string;
    description: string;
}
export interface ISettings {
    ui: IUiSettings;
}
export interface IUiSettings {
    isDarkTheme: boolean;
    mainNav: IPrimaryDrawer;
}
// ================================================================================================================
export interface ISolutionTreeItem {
    title: string;
    path?: string;
    type: 'project' | 'directory' | 'file' | 'reference' | 'asset';
    id?: string;
    children?: ISolutionTree;
    childrenCount: number | undefined;
}

export interface ISolutionTree extends Array<ISolutionTreeItem> {}

// ================================================================================================================
// export const LoadedCpSolution: IConstructor<ILoadedSolution> = undefined;
// export const CpSolutionMeta: IConstructor<ISolutionMeta> = undefined;
// export const CpSolution: IConstructor<ISolution> = undefined;
// export const CpProject: IConstructor<IProject> = undefined;
// export const CpReference: IConstructor<IReference> = undefined;
// export const CpAsset: IConstructor<IProject> = undefined;
// export const CpAssetFile: IConstructor<IAssetFile> = undefined;

// interface IConstructor<T> {
// 	(value?: any): T;
// 	readonly prototype: T;
// 	new (...args: any[]): T;
// }
