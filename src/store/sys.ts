import { defineStore } from 'pinia'
import { Viewer } from 'cesium'

export interface SysStore {
  cesiumViewer: Viewer | null,
  currentComponentKey: String,
}

export const useSysStore = defineStore({
  id: 'sys',
  state: (): SysStore => ({
    cesiumViewer: null,
    currentComponentKey: '', //当前选择的功能的key
  }),
  actions: {
    setCesiumViewer(viewer: Viewer) {
      this.cesiumViewer = viewer
    },
    setCurrentComponentKey(key: String) {
      this.currentComponentKey = key
    }
  }
})
