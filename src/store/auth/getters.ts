import {appConfigStore, Defaults, IAppConf, ReadyAppConfig} from "@/appConfig";
import {IAsset, IAssetFlow, ILoadedSolution, IPrimaryDrawer, 
	IProject, IProjectFlow, IReference, IReferenceFlow, IResourceFlow,
	ISettings, ISolution, ISolutionFlow, ISolutionMeta} from "@/components/CoderplaySolutionTypes";
import fs from 'fs';
import {GetterTree} from "vuex";
import { IRootState } from '../types';
import AuthState from "./state";
import * as types from "./types";
// tslint:disable-next-line: no-var-requires
const uuidV4 = require('uuid/v4');

const getters: GetterTree<typeof AuthState, IRootState> = {
	
}

export default getters;
