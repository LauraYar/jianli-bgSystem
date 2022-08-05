<template>
  <div class="article-page">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电子商务子系统</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 文章管理栏 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文章管理" name="first"></el-tab-pane>
      <el-tab-pane label="未发布文章管理" name="second"></el-tab-pane>
    </el-tabs>
    <!-- 卡片区域 -->
    <el-card class="article-card" style="width: 100%">
      <el-button
        @click="handleBatchRemoveArticle()"
        type="danger"
        size="small"
        icon="el-icon-delete"
        >批量删除文章</el-button
      >
      <el-button
        @click="addArticle"
        type="primary"
        size="small"
        icon="el-icon-circle-plus"
        style="margin-right: 20px"
        >添加文章</el-button
      >
      <el-select
        @change="selectArticleTypeList"
        v-model="articleType"
        size="small"
        placeholder="请选择文章类型"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="listQuery.title"
        placeholder="标题"
        size="small"
        clearable
        style="width: 120px; margin-left: 10px"
      ></el-input>
      <el-button
        @click="handleFilter"
        size="small"
        type="primary"
        icon="el-icon-search"
        style="margin: 20px"
        >查询</el-button
      >
      <div></div>
      <!-- table表格区域 -->
      <!--  @selection-change="checkSelect"全选框事件 -->
      <el-table :data="articleList" border stripe style="width: 100%">
        <el-table-column type="selection" label="全选"> </el-table-column>
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}</template
          >
        </el-table-column>
        <el-table-column align="center" label="标题" min-width="160">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.title"
              placement="top"
            >
              <el-link
                type="primary"
                :underline="false"
                @click="editDialogRow(scope.row.id)"
                >{{ scope.row.title }}</el-link
              >
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="浏览量" width="100">
          <template slot-scope="scope">
            <!-- pageviews没有0这个值。 -->
            <el-tag v-if="scope.row.hasOwnProperty('pageviews')" type="success">
              {{ scope.row.pageviews }}</el-tag
            >
            <el-tag v-else type="success">0</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文章状态" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="activeName === 'first'"
              type="success"
              size="mini"
              style="width: 80px"
              @click="handleModifyStatus(scope.row, 0)"
            >
              已发布
            </el-button>
            <el-button
              v-if="activeName === 'second'"
              type="danger"
              size="mini"
              style="width: 80px"
              @click="handleModifyStatus(scope.row, 1)"
            >
              待发布
            </el-button></template
          >
        </el-table-column>
        <el-table-column align="center" label="发布时间" width="160">
          <template slot-scope="scope"
            ><span>{{ scope.row.pub_time }}</span></template
          >
        </el-table-column>
        <el-table-column align="center" label="作者" width="120">
          <template slot-scope="scope"
            ><span>{{ scope.row.author }}</span></template
          >
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editDialogRow(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              icon="el-icon-delete"
              @click="deleteRow(scope.row)"
              size="mini"
              type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[15, 20, 25, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加文章的对话框 -->
    <el-dialog
      @close="DialogClose()"
      title="文章管理"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息"></el-tab-pane>
      </el-tabs>
      <el-form
        :model="row"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="文章分类" prop="articleTypeid">
              <el-select
                v-model="row.articleTypeid"
                placeholder="请选择文章分类"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>

          <el-col :span="12">
            <el-form-item label="文章作者">
              <el-input
                v-model="row.author"
                clearable
                maxlength="50"
                placeholder="请输入文章作者"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="发布系统:" prop="systemId">
              <el-select
                multiple
                v-model="row.systemId"
                placeholder="请选择发布系统"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sysOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="文章状态" prop="articleStatus">
              <el-radio v-model="row.articleStatus" label="1"
                >立即发布</el-radio
              >
              <el-radio v-model="row.articleStatus" label="0"
                >暂存未发布</el-radio
              >
            </el-form-item></el-col
          >
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="文章标题">
              <el-input
                v-model="row.title"
                clearable
                maxlength="100"
                placeholder="请输入文章标题"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="发布时间" prop="pubTime">
              <el-date-picker
                v-model="row.pubTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
                @input="$forceUpdate()"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 富文本编辑器 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="文章内容:" prop="content">
              <quill-editor
                class="editor"
                ref="myTextEditor"
                v-model="row.content"
                :options="editorOption"
              >
              </quill-editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRow">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userService from '@/global/service/user';
import { dzswArticleType } from '@/utils/commerceArticle/select.js';
export default {
  data() {
    return {
      listQuery: {
        title: '',
      },
      value3: '',
      // 默认显示文章管理
      activeName: 'first',
      // table里获取文章列表
      articleList: [],
      // 当前的页数
      pageNum: 1,
      // 当前每页显示数据条数
      pageSize: 15,
      //加载动画
      listLoading: false,
      //系统类型
      sysType: '电子商务系统',
      //文章类型
      articleType: '政策法规',
      //发布状态
      status: 1,
      total: 0,
      options: dzswArticleType,
      // 新增文章对话框的显示
      dialogVisible: false,
      // 增加文章对象
      row: {
        articleTypeid: '',
        author: '',
        articleStatus: '1',
        title: '',
        content: '',
        systemId: [],
        simple: '',
        pubTime: '',
      },
      //系统选择框
      sysOptions: [
        {
          value: '1',
          label: '电子商务系统',
          disabled: false,
        },
        {
          value: '2',
          label: '公益性系统',
          disabled: true,
        },
        {
          value: '3',
          label: '追溯信息系统',
          disabled: true,
        },
      ],
      // 验证规则
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        pubTime: [
          { required: true, message: '请选择日期和时间', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
        ],
        systemId: [
          { required: true, message: '请选择系统分类', trigger: 'blur' },
        ],
        articleTypeid: [
          { required: true, message: '请选择文章分类', trigger: 'blur' },
        ],
        author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        articleStatus: [
          { required: true, message: '请输入状态', trigger: 'blur' },
        ],
      },
      // 添加文章的文章内容
      editorOption: {
        placeholder: '请在这里添加文章内容', //提示
        theme: 'snow', //主题 snow/bubble
      },
    };
  },

  created() {
    // console.log(this.options);
    this.getArticleList();
  },
  methods: {
    // val与：value:xx对应
    selectArticleTypeList(val) {
      // console.log(val);
      this.articleType = val;
      this.getArticleList();
    },
    // 查询
    handleFilter() {
      this.pageNum = 1;
      this.getArticleList();
    },
    // 获取文章列表
    getArticleList() {
      let status = this.activeName == 'first' ? '1' : '0';
      let params = {
        pageNum: this.pageNum,
        pageRow: this.pageSize,
        sysType: this.sysType,
        articleType: this.articleType,
        status,
      };
      // console.log(status);
      if (this.listQuery.title !== '') {
        params.title = this.listQuery.title;
      }
      userService.getArticleList(params).then((res) => {
        // console.log(res);
        this.articleList = res.data.rows;
        this.total = res.data.total;
      });
    },
    //获取分页每页显示数据条数
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getArticleList();
    },
    //获取当前分页页数
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
      this.getArticleList();
    },
    handleModifyStatus(row, item) {
      console.log('状态的按钮被调用了');
      let status = item === 0 ? '待发布' : '已发布';
      // this.$confirm().then(()=>{})
      this.$confirm(`是否将文章状态修改为 ${status} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {});
    },
    // 点击tab切换
    handleClick() {
      this.getArticleList();
    },
    // 点击添加文章
    addArticle() {
      this.dialogVisible = true;
      this.row.articleTypeid = this.articleType;
      // console.log(this.row.articleTypeid);
      if (this.row.articleTypeid === '政策法规') {
        this.sysOptions.map((item) => {
          this.row.systemId.push(item.label);
        });
      } else {
        this.sysOptions.map((item) => {
          if (item.disabled === false) {
            this.row.systemId.push(item.label);
          }
        });
      }
    },
    // 关闭增加文章对话框(清除填写记录)
    DialogClose() {
      this.row = {
        articleTypeid: '',
        author: '',
        articleStatus: '',
        title: '',
        content: '',
        systemId: [],
      };
      this.flag = 'add';
      this.$refs.addFormRef.resetFields();
    },
    // 新增文章对话框的提交（验证表单信息）
    submitRow() {
      if (this.flag == 'add') {
        this.$refs.addFormRef.validate((valid) => {
          if (!valid)
            return this.$message.error(
              '信息填写不完整或不准确，请检查再提交！'
            );
          userService.articleAdd(this.row).then((res) => {
            if (res.status !== 200) return this.$message.error('失败');
            this.$message.success('新增文章成功');
            // 隐藏添加文章的对话框
            this.dialogShow = false;
            // 重新获取文章
            this.getArticleList();
          });
        });
      } else if (this.flag == 'edit') {
        this.editArticleSubmit();
      }
    },

    // 展示修改文章对话框
    editDialogRow(id) {
      console.log(id);
      let status = this.activeName == 'first' ? '1' : '0';
      this.dialogVisible = true;
      userService.getArticleId(id).then((res) => {
        console.log(res);
        // status = this.row.articleStatus;
        // 拿到当前编辑列的数据
        this.row.articleStatus = status;
        // 对话框文章内容
        this.row.content = res.data.content;
        // 对话框发布时间
        this.row.pubTime = res.data.crtTime;
        // 对话框发布标题
        this.row.title = res.data.title;
        this.row.author = res.data.author;
        this.row.articleStatus = res.data.isDeleted;
        // let sysArr = res.data.articleSysList;
        let sysArr = [];
        res.data.articleSysList.map((item) => {
          sysArr.push(item.systemId);
        });
        // 对话框文章分类，发布系统，文章状态
        // 发布系统
        this.row.systemId = sysArr;
        console.log(sysArr);
        this.row.articleTypeid = res.data.articleSysList[0].articleTypeid;
        this.row.articleStatus = status;
      });
    },
    // 操作中删除文章
    async deleteRow(data) {
      let params = {
        id: data.id,
        sysType: this.sysType,
      };
      const confirmResult = await this.$confirm(
        '此操作将删除该文章,是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err);
      if (confirmResult !== 'confirm')
        return this.$message.info('已经取消删除');
      userService.articleDelete(params).then((res) => {
        console.log(res);
        if (res.status !== 200) return this.$message.error('删除文章失败');
        this.$message.success('删除文章成功');
        this.getArticleList();
      });
    },
    // 批量删除文章
    async handleBatchRemoveArticle() {
      if (this.ids.length === 0)
        return this.$message.warning('请先选中要删除的文章');
      const confirmResult = await this.$confirm(
        '此操作将删除选中文章,是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err);
      if (confirmResult !== 'confirm')
        return this.$message.info('已经取消删除');
      this.ids.forEach((id, index) => {
        let params = {
          id: id,
          sysType: this.sysType,
        };
        userService.articleDelete(params).then((res) => {
          if (res.status !== 200) return this.$message.error('删除文章失败');
          this.$message.success('删除成功');
          this.ids.splice(index, 1);
          this.getArticleList();
        });
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
