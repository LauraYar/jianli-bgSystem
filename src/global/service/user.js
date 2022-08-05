import request from '../request/axios';
import API from '../request/api';

const userService = {
  login(params) {
    return request.post(API.login, params);
  },
  //文章管理获取文章列表
  getArticleList(params) {
    return request.get(API.articleList, params);
  },
  getArticleListPage(params) {
    return request.get(API.articleListPage, params);
  },
  //文章管理通过文章id获取文章数据(修改按钮打开获取该行数据)
  getArticleId(id) {
    return request.get(API.articleId(id));
  },
  //文章管理系统删除文章
  articleDelete(params) {
    return request.delete(API.articleDel, params);
  },
  //文章管理增加文章
  articleAdd(params) {
    return request.post(API.articleAdd, params);
  },
  //文章管理更新文章
  articleUpdate(params) {
    return request.put(API.articleUpdate, params);
  },
};
export default userService;
