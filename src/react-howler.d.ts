// src/react-howler.d.ts
declare module 'react-howler' {
    import { Howl, Howler } from 'howler';
    import * as React from 'react';
  
    export interface ReactHowlerProps {
      src: string | string[];
      format?: string[];
      playing?: boolean;
      mute?: boolean;
      volume?: number;
      loop?: boolean;
      preload?: boolean;
      html5?: boolean;
      onEnd?: () => void;
      onLoad?: () => void;
      onLoadError?: (id: number, error: any) => void;
      onPlayError?: (id: number, error: any) => void;
      onPause?: () => void;
      onPlay?: (id: number) => void;
      onStop?: (id: number) => void;
      onSeek?: (id: number) => void;
      onVolume?: (id: number) => void;
      onRate?: (id: number) => void;
      pool?: number;
      sprite?: { [key: string]: [number, number] };
      rate?: number;
      xfade?: number;
      render?: (props: any) => React.ReactNode;
    }
  
    export default class ReactHowler extends React.Component<ReactHowlerProps> {
      stop(id?: number): void;
      pause(id?: number): void;
      play(id?: number): void;
      seek(seek?: number, id?: number): number;
      duration(id?: number): number;
      howler: Howl;
    }
  }
  