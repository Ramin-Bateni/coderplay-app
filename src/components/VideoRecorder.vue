<template>
    <v-card class="cp-light-1">
        <v-toolbar dense color="black">
            <v-toolbar-title>{{ recordInfo.title }}</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn
                v-if="!isRecording"
                icon
                fab
                small
                color="#de112e"
                @click="startRecording('video1')"
                >REC</v-btn
            >
            <v-btn
                v-else
                icon
                fab
                small
                color="#de112e"
                @click="stopRecording('video1')"
                >stop</v-btn
            >
        </v-toolbar>

        <div class="videoRec text-xs-center">
            <video ref="video" class="video" controls></video>
            <input
                type="hidden"
                ref="video_h"
                name="video"
                v-model="videoModel"
            />
        </div>

        <div class="video-controllers">
            <v-btn @click="startRecording('video1')">
                <v-icon :color="isRecording ? 'red' : ''">play_arrow</v-icon>
            </v-btn>
            <v-btn @click="stopRecording('video1')">
                <v-icon>stop</v-icon>
            </v-btn>
            <v-btn @click="download('video1')">
                <v-icon>get_app</v-icon>
            </v-btn>
        </div>

        <v-card-text>{{ recordInfo.description }}</v-card-text>

        <v-card-title>Audio Input Devices</v-card-title>
        <ul>
            <li
                v-for="audioInput in detectRTC.audioInputDevices"
                v-bind:key="audioInput.deviceId"
            >
                {{ audioInput.label }}
            </li>
        </ul>

        <v-card-title>Video Input Devices</v-card-title>
        <ul>
            <li
                v-for="videoInput in detectRTC.videoInputDevices"
                v-bind:key="videoInput.deviceId"
            >
                {{ videoInput.label }}
            </li>
        </ul>
    </v-card>
    <!-- <video
					width="100%"
					style="min-height:240px;min-width:280px; width:100%;"
					:autoplay="recordInfo.player.autoplay"
					:controls="recordInfo.player.controlesVisibility"
					src="https://www.w3schools.com/tags/movie.mp4"
				>
					Your browser does not support the video tag.
	</video>-->
</template>

<script lang="ts">
import { DesktopCapturerSource } from 'electron';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import { IPlayer } from './CoderplaySolutionTypes';
import { IRecordInfo } from './CoderplaySolutionTypes';

// tslint:disable-next-line:no-var-requires
const { desktopCapturer } = require('electron');
// tslint:disable-next-line:no-var-requires
const RecordRTC = require('recordrtc');
// tslint:disable-next-line:no-var-requires
const DetectRTC = require('detectrtc');

export default {
    name: 'Video',
    props: [''],
    data() {
        return {
            poster: '/src/assets/video-camera.png',
            videoModel: '',
            detectRTC: [],
            player: {
                fullscreen: false,
                picInPic: false,
                autoplay: false,
                controlesVisibility: true,
            } as IPlayer,
            stream: (undefined as unknown) as MediaStream,
            recRTC: {} as any,
            isRecording: false,
        };
    },
    methods: {
        successCaptureCallback(stream: MediaStream) {
            this.stream = stream;

            const videoElement = this.$refs.video as HTMLMediaElement;
            videoElement.srcObject = this.stream; // stream; // window.URL.createObjectURL();
            // videoElement.setAttribute('width', '500px');
            videoElement.muted = true;
            videoElement.play();
            // this.toggleControls();
        },
        errorCaptureCallback(e: any) {
            // console.log('errorCallback >> ', e);
            // handle error here
        },
        processVideo(audioVideoWebMURL: any) {
            const video = this.$refs.video as HTMLMediaElement;
            video.src = audioVideoWebMURL;
            // this.toggleControls();
            const recordedBlob = this.recRTC.getBlob();
            this.isRecording = false;
            this.saveBlob(recordedBlob);
            // tslint:disable-next-line:only-arrow-functions
            this.recRTC.getDataURL(function (dataURL: any) {
                // TODO
                return;
            });
        },
        startCapture() {
            capScreen(
                this.successCaptureCallback.bind(this),
                this.errorCaptureCallback.bind(this)
            );
        },
        startRecording() {
            // this.poster = '';
            // const mediaConstraints = {
            // 	video: true,
            // 	// {
            // 	// 	mandatory: {
            // 	// 		minWidth: 700,
            // 	// 		minHeight: 720,
            // 	// 	},
            // 	// },
            // 	audio: true,
            // };
            // navigator.mediaDevices
            // 	.getUserMedia(mediaConstraints)
            // 	.then(
            // 		this.successCallback.bind(this),
            // 		this.errorCallback.bind(this)
            //     );
            if (!this.stream) {
                alert('Please first start the capture');
                return;
            }

            try {
                this.isRecording = true;
                const options = {
                    type: 'video',
                    mimeType: 'video/webm;codecs=vp9', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
                    // audioBitsPerSecond: 128000,
                    // videoBitsPerSecond: 128000,
                    // timeSlice: 2000,
                    // bitsPerSecond: 128000, // if this line is provided, skip above two
                };
                this.recRTC = RecordRTC(this.stream, options);
                this.recRTC.startRecording();
            } catch (error) {
                this.isRecording = false;
            }
        },
        stopRecording(video = 'video') {
            this.poster = '';
            // const recRTC = this.recRTC;
            this.recRTC.stopRecording(this.processVideo.bind(this));
            // this.stream.getAudioTracks().forEach(track => track.stop());
            // this.stream.getVideoTracks().forEach(track => track.stop());
        },
        download(video = 'video') {
            this.recRTC.save('video.webm');
            // RecordRTC.writeToDisk(RecordRTC.get);
            // const file = new File([blob], 'name');
            // fs.writeFileSync('someVideo.mp4', blob);
        },
        saveBlob(blob: any) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    const result = reader.result;
                    if (result instanceof ArrayBuffer && result != null) {
                        const buffer = new Buffer(result);
                        const fileName = 'myVideo.mp4';
                        ipcRenderer.send('SAVE_FILE', fileName, buffer);
                        // tslint:disable-next-line:no-console
                        console.log(
                            `Saving ${JSON.stringify({
                                fileName,
                                size: blob.size,
                            })}`
                        );
                    }
                }
            };
            reader.readAsArrayBuffer(blob);
            ipcRenderer.on('SAVED_FILE', (event: any, path: any) => {
                // tslint:disable-next-line:no-console
                console.log('Saved file ' + path);
            });
        },
    },
    computed: {
        recordInfo(): IRecordInfo {
            const defaults: IRecordInfo = {
                title: 'Recorder Preview',
                description:
                    'The preview of the sources that will be records if you press the REC button!',
                player: {
                    ...this.$data.player,
                    fileType: '',
                    url: '',
                    poster: '',
                },
            };
            return defaults;
        },
    },
    mounted() {
        const video = this.$refs.video as HTMLMediaElement;
        video.muted = false;
        video.controls = false;
        video.autoplay = true;
        // debugger;
        this.startCapture();
    },
    created(): void {
        const me = this;
        DetectRTC.load(() => {
            // debugger;
            me.$data.detectRTC = DetectRTC;
            // console.log(DetectRTC.audioInputDevices);
        });

        if (
            !navigator.getDisplayMedia &&
            !navigator.mediaDevices &&
            // tslint:disable-next-line:no-string-literal
            !navigator.mediaDevices['getDisplayMedia']
        ) {
            // var error = 'Your browser does NOT support the getDisplayMedia API.';
            // document.querySelector('h1').innerHTML = error;
            // document.querySelector('video').style.display = 'none';
            // document.getElementById('btn-start-recording').style.display = 'none';
            // document.getElementById('btn-stop-recording').style.display = 'none';
            throw new Error('error');
        }
    },
};

// function invokeGetDisplayMedia(success: any, error: any) {
// 	let displaymediastreamconstraints = {
// 		video: {
// 			displaySurface: 'monitor', // monitor, window, application, browser
// 			logicalSurface: true,
// 			cursor: 'always', // never, always, motion
// 		},
// 	};
// 	// above constraints are NOT supported YET
// 	// that's why overridnig them
// 	displaymediastreamconstraints = {
// 		video: true,
// 	};
// 	if (navigator.mediaDevices.getDisplayMedia) {
// 		navigator.mediaDevices
// 			.getDisplayMedia(displaymediastreamconstraints)
// 			.then(success)
// 			.catch(error);
// 	} else {
// 		navigator
// 			.getDisplayMedia(displaymediastreamconstraints)
// 			.then(success)
// 			.catch(error);
// 	}
// }
function capScreen(
    successCallback: (stream: MediaStream) => void,
    handleError: (stream: MediaStream) => void
) {
    desktopCapturer
        .getSources({ types: ['window', 'screen'] })
        .then(async (sources: any) => {
            for (const source of sources) {
                if (source.name === 'Entire Screen') {
                    try {
                        const myStream = await navigator.mediaDevices.getUserMedia(
                            {
                                audio: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                    },
                                } as MediaTrackConstraints,
                                video: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                        // chromeMediaSourceId: source.id,
                                        minWidth: 1280,
                                        maxWidth: 1280,
                                        minHeight: 720,
                                        maxHeight: 720,
                                    } as MediaTrackConstraints,
                                },
                            } as MediaStreamConstraints
                        );
                        // debugger;

                        successCallback(myStream);
                    } catch (e) {
                        handleError(e);
                    }
                    return;
                    // navigator.webkitGetUserMedia(
                    // 	{
                    // 		audio: true,
                    // 		video: true,
                    // 		//  {
                    // 		// 	mandatory: { minWidth: 1280, minHeight: 720 },
                    // 		// },
                    // 	},
                    // 	async (stream: any) => {
                    // 		// const options = {
                    // 		//     type: 'video',
                    // 		//     // mimeType: 'video/webm;codecs=vp9', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
                    // 		//     // audioBitsPerSecond: 128000,
                    // 		//     // videoBitsPerSecond: 128000,
                    // 		//     // timeSlice: 2000,
                    // 		//     // bitsPerSecond: 128000, // if this line is provided, skip above two
                    // 		// };
                    // 		// this.stream = stream;
                    // 		// this.recRTC = RecordRTC(stream, options);
                    // 		// this.recRTC.startRecording();
                    // 		// const videoElement = this.$refs.video as HTMLMediaElement;
                    // 		// videoElement.srcObject = stream; // stream; // window.URL.createObjectURL();
                    // 		// videoElement.play();
                    // 	},
                    // 	handleError
                    // );
                    // try {
                    // 	const stream = await navigator.mediaDevices.getUserMedia(
                    // 		{
                    // 			audio: false,
                    // 			video: {
                    // 				mandatory: {
                    // 					chromeMediaSource: 'desktop',
                    // 					chromeMediaSourceId: source.id,
                    // 					minWidth: 1280,
                    // 					maxWidth: 1280,
                    // 					minHeight: 720,
                    // 					maxHeight: 720,
                    // 				},
                    // 			},
                    // 		}
                    // 	);
                    // 	successCallback(stream);
                    // } catch (e) {
                    // 	handleError(e);
                    // }
                    // return;
                }
            }
        });
}
// function captureScreen(callback: any) {
// 	invokeGetDisplayMedia(
// 		function(screen: any) {
// 			console('invokeGetDisplayMedia > success');
// 			addStreamStopListener(screen, function() {
// 				// document.getElementById('btn-stop-recording').click();
// 			});
// 			callback(screen);
// 		},
// 		function(error: any) {
// 			console.error(error);
// 			alert(
// 				'Unable to capture your screen. Please check console logs.\n' +
// 					error
// 			);
// 		}
// 	);
// }
function stopRecordingCallback(recorder: any, videoElement: HTMLMediaElement) {
    videoElement.src = '';
    videoElement.srcObject = null;
    videoElement.srcObject = recorder.getBlob(); // URL.createObjectURL(recorder.getBlob());

    recorder.screen.stop();
    recorder.destroy();
    recorder = null;
    // document.getElementById('btn-start-recording').disabled = false;
}
function addStreamStopListener(stream: any, callback: any) {
    stream.addEventListener(
        'ended',
        () => {
            callback();
            callback = () => {
                return;
            };
        },
        false
    );
    stream.addEventListener(
        'inactive',
        () => {
            callback();
            callback = () => {
                return;
            };
        },
        false
    );
    stream.getTracks().forEach((track: any) => {
        track.addEventListener(
            'ended',
            () => {
                callback();
                callback = () => {
                    return;
                };
            },
            false
        );
        track.addEventListener(
            'inactive',
            () => {
                callback();
                callback = () => {
                    return;
                };
            },
            false
        );
    });
}
</script>

<style scoped>
.video {
    /* box-shadow: 1px 6px 10px 2px rgba(35, 35, 35, 0.62); */
    /* height: 400px; */
    /* max-height: 800px; */
    border: 1px solid #111;
    border-width: 2px 0;
    min-height: 240px;
    min-width: 280px;
    width: 100%;
    object-fit: fill;
    background: black;
}
</style>
