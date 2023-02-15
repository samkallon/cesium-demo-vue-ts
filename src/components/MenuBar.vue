<template>
  <div :style="{backgroundColor:bgColor}">
    <div :style="{padding:'8px',color:fontColor,display:'flex',justifyContent:'space-around'}">
      <div>
        <a-switch :checked="mode === 'vertical'" @change="changeMode" /> 切换展开
      </div>
      <div>
        <a-switch :checked="theme === 'dark'" @change="changeTheme" /> 主题
      </div>
    </div>
    <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        style="width: 256px"
        :mode="mode"
        :theme="theme"
    >
      <a-menu-item key="DigTerrian">
        地形开挖
      </a-menu-item>
      <a-menu-item key="GroundTransparent">
        地表透明
      </a-menu-item>
      <a-menu-item key="CzmlPower">
        czml驱动
      </a-menu-item>
      <a-sub-menu key="model">
        <template #title>模型调整</template>
        <a-menu-item key="ModelMatrix">
          数值调整
        </a-menu-item>
        <a-menu-item key="ModelAdjust">
          拖动调整
        </a-menu-item>
      </a-sub-menu>

<!--      <a-menu-item key="fly">-->
<!--        飞行漫游-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        动态墙体-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        dom-点扩散-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        多场景同步，二三维地图同步，鹰眼-->
<!--&lt;!&ndash;        https://sandcastle.cesium.com/?src=Multiple%20Synced%20Views.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        坡度坡向等高线-->
<!--&lt;!&ndash;        https://sandcastle.cesium.com/?src=Globe%20Materials.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        3dtile颜色修改-->
<!--&lt;!&ndash;        https://sandcastle.cesium.com/?src=3D%20Tiles%20Batch%20Table%20Hierarchy.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        3D tiles的裁切，用于做剖面分析，管线开挖分析-->
<!--        &lt;!&ndash;https://sandcastle.cesium.com/?src=3D%20Tiles%20Clipping%20Planes.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        3D tiles简模，图形拾取，图形轮廓线，简模属性表格显示，名称div跟随鼠标显示-->
<!--        &lt;!&ndash;https://sandcastle.cesium.com/?src=3D%20Tiles%20Feature%20Picking.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        粒子系统-->
<!--        &lt;!&ndash;https://sandcastle.cesium.com/?src=Particle%20System%20Fireworks.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        材质集中示例-->
<!--        &lt;!&ndash;https://sandcastle.cesium.com/?src=Materials.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        等高线材质-->
<!--        &lt;!&ndash;https://sandcastle.cesium.com/?src=Elevation%20Band%20Material.html&ndash;&gt;-->
<!--      </a-menu-item>-->
<!--      <a-menu-item key="dynamicWall">-->
<!--        视频材质-->
<!--        &lt;!&ndash;https://sandcastle.cesium.com/?src=Video.html&ndash;&gt;-->
<!--      </a-menu-item>-->
    </a-menu>
  </div>
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs, watchEffect} from 'vue';
import { useSysStore } from '@/store/sys'
import type { MenuMode, MenuTheme } from 'ant-design-vue';
export default defineComponent({
  components: {
  },
  setup() {
    const sysStore = useSysStore()
    const state = reactive({
      mode: 'inline' as MenuMode,
      theme: 'dark' as MenuTheme,
      selectedKeys: ['DigTerrian'],
      openKeys: [''],
      bgColor: '#001529',
      fontColor: '#fff'
    });
    const changeMode = (checked: boolean) => {
      state.mode = checked ? 'vertical' : 'inline';
    };
    const changeTheme = (checked: boolean) => {
      state.theme = checked ? 'dark' : 'light';
      state.bgColor = checked ? '#001529' : '#fff'
      state.fontColor = !checked ? '#001529' : '#fff'
    };
    watchEffect(() => sysStore.setCurrentComponentKey(state.selectedKeys[0]))
    return {
      ...toRefs(state),
      changeMode,
      changeTheme,
    };
  },
});
</script>

