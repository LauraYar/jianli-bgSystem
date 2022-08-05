const PREFIX_API_1 = 'http://39.104.61.47:8776'; // 电子商务系统
const PREFIX_API_2 = 'http://39.104.61.47:8766'; //信息追溯系统

export default {
  // 用户登录
  login: `${PREFIX_API_1}/user/login`,
  //追溯信息系统
  //文章管理获取文章列表
  articleList: `${PREFIX_API_2}/article/list`,
  articleListPage: `${PREFIX_API_2}/article/listArticleByPage`,
  //文章管理通过文章id获取文章数据
  articleId: (id) => `${PREFIX_API_2}/article/id?id=${id}`,
  //文章管理系统删除文章
  articleDel: `${PREFIX_API_2}/article/delStatus`,
  //文章管理增加文章
  articleAdd: `${PREFIX_API_2}/article/add`,
  //文章管理更新文章
  articleUpdate: `${PREFIX_API_2}/article/update`,
};
