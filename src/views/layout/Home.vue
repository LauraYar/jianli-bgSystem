<template>
  <el-container class="home-container">
    <el-header class="header">
      <div class="title">监利市农业信息后台管理系统</div>
      <div class="login">
        <div class="avatar">
          <img
            src="../../assets/images/user-logo.png"
            alt=""
            :class="{ unfold: isCollapse }"
          />
          <span>admin</span>
        </div>
        <el-button type="info" size="small" @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '260px'" class="page-left">
        <div class="sidebar" height="48px">
          <div class="side-btn" @click="toggleCollapse">
            <img
              src="../../assets/images/fold.png"
              alt=""
              :class="{ unfold: isCollapse }"
            />
          </div>
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="`${item.id}`"
            v-for="item in sideMenu"
            :key="item.id"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.systemName }}</span>
            </template>
            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i :class="subItem.icon"></i>
                <span> {{ subItem.systemItem }}</span>
              </template>
            </el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import sideMenu from '@/utils/sideMenu';
export default {
  data() {
    return {
      sideMenu,
      isCollapse: false,
      //被激活的链接地址
      activePath: '/commerce-article',
    };
  },
  components: {},

  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {},
  },
};
</script>

<style scoped lang="less">
.home-container {
  height: 100vh !important;
}
.header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  height: 70px;
  .title {
    display: flex;
    align-items: center;

    margin-left: 15px;
  }
  .login {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 280px;
    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
      span {
        margin-left: 10px;
      }
    }
  }
}
.el-aside {
  box-sizing: border-box;
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #f1f3f4;
}
.iconfont {
  margin-right: 16px;
}

.page-left {
  width: 246px;
  transition: all 0.2s ease-out;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  .sidebar {
    padding: 8px;
    height: 48px;
    overflow: hidden;
    background: #333744;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    .side-btn {
      height: 32px;
      text-align: center;
      background: #4a5064;
      border-radius: 3px;
      cursor: pointer;
      &:hover {
        background: #495170;
      }
      img {
        margin-top: 6px;
        width: 20px;
        height: 20px;
        transition: all 0.2s ease-out;
        &.unfold {
          transform: rotate(-180deg);
        }
      }
    }
  }
}
</style>
