<?
/**
 * 스키넬 피카사 플러그인
 *
 * @package net.lovelyus.g5.plugin.picasa
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license CC BY-NC-ND http://creativecommons.org/licenses/by-nc-nd/3.0/deed.ko
 * @link http://lovelyus.net
 * */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

//error_reporting(E_ALL);
//ini_set('display_errors', '1');


set_include_path(get_include_path() . PATH_SEPARATOR . dirname(__FILE__) . DS . 'lib');

define('SL_PICASA_CONFIG_FILE', 'cfg.plugin.picasa.php');
define('SL_PICASA_SCOPE', $gp_scope);

$luPicasa = new LUPicasa();
$luPicasa->hook($gp_scope);

class LUPicasa {

    var $id;
    var $config_file;
    var $plugin_config;
    var $plugin_path;
    var $plugin_url;
    var $do_url;
    var $scope;

    function hook($scope) {
        global $bo_table, $wr_id, $gr_id, $member, $is_guest;
        $this->scope = $scope;
        
        if($scope == GP_SCOPE_BOARD) define('SL_PICASA_SCOPE_ID', $bo_table);
        else define('SL_PICASA_SCOPE_ID', $gr_id);
        
        $this->config_file = SL_PICASA_CONFIG_FILE;
        $this->id = gp_plugin_id(__FILE__);
        $this->plugin_path = dirname(__FILE__);
        $this->plugin_url = gp_plugin_url(__FILE__);
        $this->plugin_config = gp_read_config($this->config_file, array('view_thumb'=>'thumb2'), $this->scope);
        $this->do_url = GP_URL . '/do.php?scope=' . $this->scope . '&bo_table=' . $bo_table . '&wr_id=' . $wr_id . '&id=' . $this->id . '&act=picasa_call';

        gp_add_filter('gpa_settings', array($this, 'sl_picasa_setting'), 10); // '스키넬관리 > 설정 > 피카사' 추가 등록
        gp_add_action('px_picasa_do', array($this, 'sl_picasa_call')); // 피카사 일반 액션 등록
        gp_add_action('pxa_picasa_save_setting', array($this, 'sl_picasa_save_setting')); // 피카사 설정 저장 액션 등록
        gp_add_action('post_write_update.tail', array($this, 'sl_picasa_regist_to_article')); // 글 작성 후
        gp_add_action('post_delete.tail', array($this, 'sl_picasa_delete_from_article')); // 글 삭제 시
        gp_add_action('post_delete_all.tail', array($this, 'sl_picasa_delete_from_article')); // 글 삭제 시

        gp_add_filter('gp_board_thumb', array($this, 'sl_picasa_thumb'), 10, 7); // 목록에 아이콘 추가
        gp_add_filter('gpa_menu_plugin_' . $this->id, array($this, 'sl_picasa_plugin_menu'));
        gp_add_action('pxa_picasa_install', array($this, 'sl_picasa_install'));
        gp_add_action('pxa_picasa_uninstall', array($this, 'sl_picasa_uninstall'));

        // 스키넬 스킨
        gp_add_filter('sl_write_items', array($this, 'sl_picasa_form')); // 글쓰기 폼 등록
        gp_add_filter('sl_view', array($this, 'sl_picasa_view')); // view 에 이미지 목록 추가
        gp_add_action('sl_view_content_top', array($this, 'sl_picasa_view_print')); // 뷰에 이미지 출력
        gp_add_action('sl_list_icons', array($this, 'sl_picasa_list_icons')); // 목록에 아이콘 추가
        gp_add_filter('sl_list', array($this, 'sl_picasa_list')); // 목록에 아이콘 추가
        //gp_add_filter('sl_css_style', array($this, 'sl_picasa_css'));

        // 일반 스킨에 적용하기 위한 액션/필터
        if (basename(GP_SKIN_PATH) != 'skinel') {
            gp_add_action('pre_list', array($this, 'on_list'));
            gp_add_action('pre_view', array($this, 'on_view'));
            gp_add_action('picasa_view_print', array($this, 'sl_picasa_view_print'), 10, 2);
            gp_add_action('picasa_print_form', array($this, 'sl_picasa_form_print'));
        }

        gp_add_action('gpa_pre_activate_plugin_'.$this->id, array($this, 'before_activate'));
    }

    function before_activate() {
      $result = mysql_query("SHOW COLUMNS FROM gpf_picasa LIKE no_view");
      $exists = (mysql_num_rows($result))?TRUE:FALSE;
      if(!$exists) {
        sql_query('ALTER TABLE gpf_picasa ADD no_view boolean NOT NULL default 0 AFTER height');
      }
    }

    function on_list() {
        global $list;
        $list = $this->sl_picasa_list($list);
    }

    function on_view() {
        global $view;
        $view = $this->sl_picasa_view($view);
    }

    ## 설정페이지에 피카사 항목 추가
    function sl_picasa_setting($gpa_settings) {
        array_push($gpa_settings, array('ID' => $this->id, 'title' => '스키넬 피카사', 'print_contents' => array($this, 'sl_picasa_config_contents'), 'order' => 10));
        return $gpa_settings;
    }

    ## 피카사 설정 저장
    function sl_picasa_save_setting() {
        gp_write_config($this->config_file, gp_strip_slashes($_REQUEST['plugin_config']), $this->scope);
        alert('피카사 플러그인 설정 저장 완료');
    }

    ## 플러그인 설정 페이지
    function sl_picasa_config_contents() {
        $plugin_config = $this->plugin_config;
        $plugin_id = $this->id;
        $plugin_path = $this->plugin_path;
        $plugin_url = $this->plugin_url;
        include_once $this->plugin_path . "/tpl/config.form.php";
    }

    ## plugins 페이지에 메뉴 추가
    function sl_picasa_plugin_menu($menus) {
        global $bo_table;
        if (gp_table_exists('gpf_picasa')) {
            array_push($menus, array('href' => gp_url('setting.php', $this->scope, $noqm = false, $this->id), 'text' => '설정'));
            array_push($menus, array('href' => gp_url('admin_do.php', $this->scope) . '&id=' . $this->id . '&act=picasa_uninstall', 'attr' => 'onclick="return confirm(\'스키넬을 통해 등록된 모든 이미지 정보가 삭제됩니다.\\n진행하시겠습니까?\');"', 'text' => 'DB제거'));
        } else {
            array_push($menus, array('href' => gp_url('admin_do.php', $this->scope) . '&id=' . $this->id . '&act=picasa_install', 'text' => 'DB생성', 'attr' => ''));
        }
        return $menus;
    }

    ## 플러그인 설치
    function sl_picasa_install() {
        global $bo_table;
        $install_script = <<<EOF
		CREATE TABLE IF NOT EXISTS `gpf_picasa` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `mb_id` varchar(20) NOT NULL,
		  `bo_table` varchar(20) NOT NULL,
		  `wr_id` int(11) NOT NULL,
		  `summary` varchar(255) NOT NULL,
		  `album_id` varchar(30) NOT NULL,
		  `photo_id` varchar(30) NOT NULL,
		  `imgurl` varchar(255) NOT NULL,
		  `width` int(11) NOT NULL,
		  `height` int(11) NOT NULL,
		  `no_view` boolean NOT NULL default 0,
		  `thumb1` varchar(255) NOT NULL,
		  `thumb1_width` int(11) NOT NULL,
		  `thumb1_height` int(11) NOT NULL,
		  `thumb2` varchar(255) NOT NULL,
		  `thumb2_width` int(11) NOT NULL,
		  `thumb2_height` int(11) NOT NULL,
		  `thumb3` varchar(255) NOT NULL,
		  `thumb3_width` int(11) NOT NULL,
		  `thumb3_height` int(11) NOT NULL,
		  `reg_date` datetime NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;
EOF;
        $f = explode(";", $install_script);
        for ($i = 0; $i < count($f); $i++) {
            if (trim($f[$i]) == "")
                continue;
            sql_query($f[$i]);
        }
        goto_url(gp_url('plugins.php', $this->scope));
    }

    ## 플러그인 제거
    function sl_picasa_uninstall() {
        global $bo_table, $sl_picasa_id;
        sql_query("DROP TABLE gpf_picasa", false);
        gp_deactivate_plugin($sl_picasa_id, $this->scope);
        goto_url(gp_url('plugins.php', $this->scope));
    }

    ## 썸네일 필터
    function sl_picasa_thumb($thumb, $bo_table, $wr_id, $wr_content, $wr_files, $thumb_width, $thumb_height) {
        global $list;
        if ($thumb)
            return $thumb;

        if (isset($list)) {
            foreach ($list as $row) {
                if ($row['wr_id'] == $wr_id) {
                    if (!empty($row['photos']))
                        return $row['photos'][0]['thumb3'];
                    break;
                }
            }
        }

        if (!empty($view['photos'])) {
            return $view['photos'][0]['thumb3'];
        }
        return $thumb;
    }

    ## 스킨 액션 ############################################
    ## 스킨 : 목록

  function sl_picasa_list($list) {
      global $bo_table;
      return $this->set_list($bo_table, $list);
  }

	function set_list($bo_table, $list)
	{
		$where_in = ' wr_id in (';
		$wr_indexer = array();
		for($i=0, $to=count($list); $i<$to; $i++)
		{
			$where_in .= " {$list[$i]['wr_id']}, ";
			$wr_indexer[$list[$i]['wr_id']] = $i;
		}
		$where_in .= " 0)";
		$res = sql_query("SELECT * FROM gpf_picasa WHERE bo_table = '$bo_table' AND $where_in ORDER BY id ASC");
		while($row = sql_fetch_array($res))
		{
            if(!$row['wr_id']) continue;
			$idx = $wr_indexer[$row['wr_id']];
			unset($row['bo_table']); unset($row['wr_id']);
			if(!isset($list[$idx]['photos'])) $list[$idx]['photos'] = array();
			array_push($list[$idx]['photos'], $row);
		}
		return $list;
	}

    ## 스킨 : 목록에 아이콘
    function sl_picasa_list_icons($row) {
        if ($row['photos']) {
            echo '<img src="' . $this->plugin_url . '/imgs/icon_picasa.png" border="0" align="absmiddle"/>';
        }
    }

    ## 스킨 : 글 등록시 이미지 등록
    function sl_picasa_regist_to_article() {
        global $wr_id, $bo_table, $member, $wr_no_view;
        sql_query("UPDATE gpf_picasa SET wr_id = '$wr_id', no_view='$wr_no_view' WHERE bo_table = '$bo_table' AND mb_id = '{$member['mb_id']}' AND (wr_id = '0' OR wr_id='$wr_id')");
    }

    ## 스킨 : 글 삭제시 이미지 삭제

    function sl_picasa_delete_from_article() {
        global $bo_table, $wr_id, $tmp_array;
        $wr_ids = array();
        if ($wr_id)
            array_push($wr_ids, $wr_id);
        if ($tmp_array)
            $wr_ids = $tmp_array;

        $this->sl_delete_picasa_photos($bo_table, $wr_ids);
    }

    ## 이미지 삭제 함수
    function sl_delete_picasa_photos($bo_table, $wr_ids) {
        $where_in = ' wr_id in (';
        $wr_indexer = array();

        for ($i = 0, $to = count($wr_ids); $i < $to; $i++) {
            $where_in .= " {$wr_ids[$i]}, ";
        }
        $where_in .= " -1)";

        if (!$nyc) {
            $nyc = new NarinPicasaClient();
            if(!$nyc->connect($this->plugin_config)) return;
        }
        $res = sql_query("SELECT * FROM gpf_picasa WHERE bo_table = '$bo_table' AND $where_in ORDER BY id ASC");
        while ($img = sql_fetch_array($res)) {
            $nyc->gp_delete_image($img['album_id'], $img['photo_id']);
        }
        sql_query("DELETE FROM gpf_picasa WHERE bo_table = '$bo_table' AND $where_in ");
    }
    function _img_info($photo_list, $id, $field) {
      $width_field = $field.'_width';
      $height_field = $field.'_height';
      if($field == 'imgurl')
      {
        $width_field = 'width';
        $height_field = 'height';
      }
      for($i=0; $i<count($photo_list); $i++) {
        if($photo_list[$i]['id'] == $id) {
          return array($photo_list[$i][$field], $photo_list[$i][$width_field], $photo_list[$i][$height_field], $photo_list[$i]['imgurl']);
        }
      }
      return false;
    }

    ## 스킨 : 글 읽기 시 이미지 설정
    function sl_picasa_view($view) {
        global $bo_table, $wr_id;
        $photo_list = array();
        $res = sql_query("SELECT * FROM gpf_picasa WHERE bo_table = '$bo_table' AND wr_id = '$wr_id' ORDER BY id ASC");
        $ids = [];
        while ($row = sql_fetch_array($res)) {
            unset($row['bo_table']);
            unset($row['wr_id']);
            array_push($photo_list, $row);
            array_push($ids, $row['id']);
        }

        if(!empty($photo_list) && $photo_list[0]['no_view'])
        {
          $wr_no_view = 1;
        } else {
          $wr_no_view = 0;
        }
        $sizes = array('s'=>'thumb1', 'm'=>'thumb2', 'l'=>'thumb3', 'o'=>'imgurl');
        preg_match_all('/{{PICASA:(\d+):(.*?)}}/', $view['content'], $matches);
        for($idx=0; $idx<count($matches[0]); $idx++) {
          if(in_array($matches[1][$idx], $ids)) {
            $img_size = '';
            $size = strtolower($matches[2][$idx]);
            if(!isset($sizes[$size])) {
              preg_match('/([\d]+)x([\d]+)/i', $size, $m);
              if($m) {
                $width = $m[1];
                $height= $m[2];
                $img_size = ' style="width:'.$width .'px;height:'.$height.'px" ';
                $size = 'o';
              } else {
                continue;
              }
            }
            $iinfo = $this->_img_info($photo_list, $matches[1][$idx], $sizes[$size]);
            $view['content'] = str_replace($matches[0][$idx], '<a href="'.$iinfo[3].'"  rel="lightbox_'.$view['wr_id'].'_group"><img src="'.$iinfo[0].'"'.$img_size.'></a>', $view['content']);
          }
        }
        
        $view['photos'] = $photo_list;



        return $view;
    }

    ## 스킨 : 글 읽기시 이미지 출력
    function sl_picasa_view_print($thumb_num = '', $css = '') 
    {
        global $bo_table, $wr_id, $view;

        $plugin_path = $this->plugin_path;
        $do_url = $this->do_url;
        $plugin_url = $this->plugin_url;
        $plugin_id = $this->id;

        if(!$thumb_num) $thumb_num = $this->plugin_config['view_thumb'];
        $photo_list = $view['photos'];
        if(!empty($photo_list) && $photo_list[0]['no_view'])
        {
          $wr_no_view = 1;
        } else {
          $wr_no_view = 0;
        }
        include_once $this->plugin_path."/tpl/view.php";
    }

    ## 글쓰기 폼 ###############################################
    ## 글쓰기 폼 아이템 등록

    function sl_picasa_form($items) {
        array_push($items, array('head' => '이미지', 'td_render' => array($this, 'sl_picasa_form_print'), 'content_render' => array($this, 'sl_picasa_form_print'), 'order' => 85));
        return $items;
    }

    ## 글쓰기 폼 출력

    function sl_picasa_form_print() {
        global $bo_table, $wr_id, $member;

        $mb_id = $member['mb_id'];

        $res = sql_query("SELECT * FROM gpf_picasa WHERE bo_table = '$bo_table' AND ( wr_id = '$wr_id' OR wr_id = '') AND mb_id = '$mb_id' ORDER BY id DESC");
        $photo_list = array();
        while($row = sql_fetch_array($res)) 
        {
          array_push($photo_list, $row);
        }

        $wr_no_view = 0;
        if(!empty($photo_list) && $photo_list[0]['no_view'] == 1) {
          $wr_no_view = 1;
        }
        $plugin_path = $this->plugin_path;
        $do_url = $this->do_url;
        $plugin_url = $this->plugin_url;
        $plugin_id = $this->id;

        extract($GLOBALS);

        include_once $this->plugin_path . '/tpl/write.form.php';
    }

    ## 피카사 액션 ########################################

    function sl_picasa_call() {
        $md = $_REQUEST['md'];
        if (!$md)
            gp_alert('피카사 : 잘못된 접근');
        $actor = new SLPicasaAction($this->scope);
        if (method_exists($actor, $md))
            $actor->$md();
        else
            gp_alert('피카사 : 잘못된 접근');
    }

}

## 피카사 액션 클래스

class SLPicasaAction {

    var $id;
    var $config_file;
    var $plugin_config;
    var $plugin_path;
    var $plugin_url;
    var $do_url;
    var $scope;

    function __construct($scope) {
        global $bo_table, $wr_id;

        $this->scope = $scope;
        $this->config_file = 'cfg.plugin.picasa.php';
        $this->id = gp_plugin_id(__FILE__);
        $this->plugin_path = dirname(__FILE__);
        $this->plugin_url = gp_plugin_url(__FILE__);
        $this->plugin_config = gp_read_config($this->config_file, array(), $this->scope);
        $this->do_url = GP_URL . '/do.php?bo_table=' . $bo_table . '&wr_id=' . $wr_id . '&id=' . $this->id . '&act=picasa_do';
    }

    function upload()
    {
      global $bo_table, $wr_id, $member, $qstr, $picture_title, $wr_no_view;

      if(!$member['mb_id']) alert("로그인 후 사용하실 수 있습니다.");

      $picture_title = stripslashes($picture_title);
      $filename = $_FILES['photo']['name'];
      $filepath = $_FILES['photo']['tmp_name'];
      if(!getimagesize($filepath)) alert("이미지파일이 아닙니다.");
      $noext = preg_replace('/(.+)\..*$/', '$1', $filename);
      if(!$picture_title) $picture_title = $noext;
      $npc = new NarinPicasaClient();
      $connected = $npc->connect($this->plugin_config);
      if(!$connected) alert('피카사 계정 연결 실패!! 계정정보를 확인해주세요.');
      $id = -1;
      $photo = array();

      list($id, $photo) = $npc->gp_upload_image($filepath, $member['mb_id'], $bo_table, $picture_title, $wr_id, $wr_no_view, $tags = '');

      if($id < 0) alert("업로드 실패 ($res)");
      ?>
      <html>
      <head>
        <title>업로드 완료</title>
        <meta charset="utf-8">
        <script type="text/javascript">
          parent.gpp.single_upload_done(<?php echo json_encode(array('code'=>1, 'img_id'=>$id, 'photo'=>$photo, 'summary'=>htmlspecialchars($picture_title), 'msg'=>"업로드 성공"));  ?>);
          location.href = '<?php echo $this->plugin_url; ?>/tpl/write.form.iframe.php?bo_table=<?php echo $bo_table; ?>&wr_id=<?php echo $wr_id; ?>'
        </script> 
      </head>
      <body></body>
      </html>
      <?php
    }

    function upload_ajax()
    {
      global $bo_table, $wr_id, $member, $mb_id, $picture_title, $is_guest, $wr_no_view;

      if(!$mb_id) die( json_encode(array('code'=>-1, 'msg'=>"로그인 후 사용하실 수 있습니다.")) );

      $picture_title = stripslashes($picture_title);
      $filename = $_FILES['Filedata']['name'];
      $filepath = $_FILES['Filedata']['tmp_name'];
      if(!getimagesize($filepath)) die( json_encode(array('code'=>-1, 'msg'=>"이미지파일이 아닙니다.")) );
      $noext = preg_replace('/(.+)\..*$/', '$1', $filename);
      if(!$picture_title) $picture_title = $noext;
      $npc = new NarinPicasaClient();
      $connected = $npc->connect($this->plugin_config);
      if(!$connected) die( json_encode(array('code'=>-1, 'msg'=>'피카사 계정 연결 실패!! 계정정보를 확인해주세요.')) );
      $id = -1;
      $photo = array();
      list($id, $photo) = $npc->gp_upload_image($filepath, $mb_id, $bo_table, $picture_title, $wr_id, $wr_no_view, $tags = '');
      if($id < 0) die( json_encode(array('code'=>-1, 'msg'=>'업로드 실패 ('.$id.')')));

      die( json_encode(array('code'=>1, 'img_id'=>$id, 'photo'=>$photo, 'summary'=>htmlspecialchars($picture_title), 'msg'=>"업로드 성공")) );
    }

    function update_summary()
    {
      global $bo_table, $wr_id, $member, $img_id, $summary;
      if(!$member['mb_id']) die( json_encode(array('code'=>-1, 'msg'=>'로그인 후 사용하세요')) );
      $img = sql_fetch("SELECT * FROM gpf_picasa  WHERE id = '$img_id' ");
      if(!$img) die( json_encode(array('code'=>-1, 'msg'=>'존재하지 않는 이미지입니다.')) );
      if($img['mb_id'] != $member['mb_id']) die( json_encode(array('code'=>-1, 'msg'=>'권한이 없습니다 : '.$img['mb_id']. ' vs ' . $member['mb_id'])) );
      $npc = new NarinPicasaClient();
      $connected = $npc->connect($this->plugin_config);
      if(!$connected) die( json_encode(array('code'=>-1, 'msg'=>'피카사 계정 연결 실패!! 계정정보를 확인해주세요.')) );
      if($npc->gp_update_summary($img['album_id'], $img['photo_id'], stripslashes($summary)))
      {
        sql_query("UPDATE gpf_picasa SET summary = '$summary' WHERE id = '$img_id'");
        die( json_encode(array('code'=>1, 'img_id'=>$img_id, 'msg'=>'업데이트 완료')) );
      }
      die( json_encode(array('code'=>-1, 'msg'=>'알수없는 오류')) );
    }

    function delete_image()
    {
      global $bo_table, $wr_id, $member, $img_id;
      if(!$member['mb_id']) die( json_encode(array('code'=>-1, 'msg'=>'로그인 후 사용하세요')) );
      $img = sql_fetch("SELECT * FROM gpf_picasa WHERE id = '$img_id' ");
      if(!$img) die( json_encode(array('code'=>-1, 'msg'=>'존재하지 않는 이미지입니다.')) );
      if($img['mb_id'] != $member['mb_id']) die( json_encode(array('code'=>-1, 'msg'=>'권한이 없습니다.')) );
      $npc = new NarinPicasaClient();
      $connected = $npc->connect($this->plugin_config);
      if(!$connected) die( json_encode(array('code'=>-1, 'msg'=>'피카사 계정 연결 실패!! 계정정보를 확인해주세요.')) );
      $npc->gp_delete_image($img['album_id'], $img['photo_id']);
      sql_query("DELETE FROM gpf_picasa WHERE id = '$img_id'");
      die( json_encode(array('code'=>1, 'img_id'=>$img_id, 'msg'=>'삭제 완료')) );
    }

}

/**
 * 나린 피카사 클라이언트 클래스 1.0 (Narin Picasa Client Class)
 * 
 * @author     chongmyung park (chongmyung.park@gmail.com, http://byfun.com)
 */
include_once 'Zend/Loader.php';
Zend_Loader::loadClass('Zend_Http_Client_Adapter_Socket');
Zend_Loader::loadClass('Zend_Gdata');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
Zend_Loader::loadClass('Zend_Gdata_Photos');
Zend_Loader::loadClass('Zend_Http_Client');
Zend_Loader::loadClass('Zend_Gdata_Photos_PhotoQuery');

final class NarinPicasaClient {

    var $picasa;
    var $user;
    var $gb;
    var $max_image_size;
    var $ymdhis;

    public function connect($email = '', $passwd = '') {
        if (is_array($email)) {
            $config = $email;
            $email = $config['email'];
            $passwd = $config['passwd'];
        }

        try {
            $client = Zend_Gdata_ClientLogin::getHttpClient($email, $passwd, Zend_Gdata_Photos::AUTH_SERVICE_NAME);
            $this->picasa = new Zend_Gdata_Photos($client);
            $this->user = $email;
            $this->ymdhis = (GB_PLATFORM == 'G5' ? G5_TIME_YMDHIS : G4_TIME_YMDHIS);
            $this->max_image_size = 1600;
            return true;
        } catch (Zend_Gdata_App_Exception $e) {
            return false;
        }
    }

    function gp_upload_image($filepath, $mb_id, $bo_table, $summary, $wr_id, $wr_no_view, $tags = '') {
        if (!file_exists($filepath)) return array(-3, array());
        $summary = strip_tags($summary);
        $tags = strip_tags($tags);
        try {
            $photo = $this->picasa->newPhotoEntry();
            $file = $this->picasa->newMediaFileSource($filepath);
            $size = getimagesize($filepath);
            $mime = $size['mime'];
            if ($mime != "image/jpeg" && $mime != "image/pjpeg" && $mime != "image/gif" && $mime != "image/png")
              return array(-1, array());
            $file->setContentType($mime);
            $photo->setMediaSource($file);
            $photo->setSummary($this->picasa->newSummary($summary));
            $photo->setTitle($this->picasa->newTitle($summary));
            $photo->mediaGroup = new Zend_Gdata_Media_Extension_MediaGroup();
            $keywords = new Zend_Gdata_Media_Extension_MediaKeywords();
            $keywords->setText($tags);
            $photo->mediaGroup->keywords = $keywords;
            $album_name = date("Y F", time());            
            $album_id_file = gp_data_path(GP_SCOPE_SITE, SL_PICASA_SCOPE_ID). "/cache.picasa_album_id.php";
            @include $album_id_file;
            if (isset($saved) && $saved['album_name'] == $album_name) {
                try {
                    $query = new Zend_Gdata_Photos_AlbumQuery();
                    $query->setAlbumId($saved['album_id']);
                    $query->setType("entry");
                    $albumEntry = $this->picasa->getAlbumEntry($query);
                    $album_id = $albumEntry->getGphotoId();
                } catch (Zend_Gdata_App_Exception $e) {
                    if ($e->getResponse()->getStatus() == 404) {
                        list($album_id, $albumEntry) = $this->gp_create_album($album_name, $album_id_file);
                    }
                }
            } else {
                list($album_id, $albumEntry) = $this->gp_create_album($album_name, $album_id_file);
            }

            if ($album_id == -1)
              return array(-5, array());

            $album = $this->picasa->newAlbumQuery();
            $album->setUser($this->user);
            $album->setAlbumId($album_id);
            $album->setImgMax($this->max_image_size);
            $photoEntry = $this->picasa->insertPhotoEntry($photo, $album->getQueryUrl());
            $album_id = $photoEntry->getGphotoAlbumId();
            $photo_id = $photoEntry->getGphotoId();
            $thumbnails = $photoEntry->getMediaGroup()->getThumbnail();

            $thumbs = array();
            foreach ($thumbnails as $thumbnail) {
                array_push($thumbs, array('url' => $thumbnail->url, 'width' => $thumbnail->width, 'height' => $thumbnail->height));
            }
            
            $c = $photoEntry->getMediaGroup()->getContent();
            $content['url'] = $c[0]->getUrl();
            $content['width'] = $c[0]->getWidth();
            $content['height'] = $c[0]->getHeight();
            $photo = array('album_id' => $album_id, 'photo_id' => $photo_id, 'imgurl' => $content['url'], 'width' => $content['width'], 'height' => $content['height'], 'thumbnails' => $thumbs);
        } catch (Zend_Gdata_App_Exception $e) {
              return array(-2, array());
        }

        sql_query("INSERT INTO gpf_picasa SET 
                        bo_table = '$bo_table', 
                        wr_id = '$wr_id', 
                        mb_id = '$mb_id', 
                        album_id = '{$photo['album_id']}', 
                        photo_id = '{$photo['photo_id']}', 
                        summary = '" . mysql_real_escape_string($summary) . "',
                        imgurl='" . mysql_real_escape_string($photo['imgurl']) . "', 
                        width='" . mysql_real_escape_string($photo['width']) . "', 
                        height='" . mysql_real_escape_string($photo['height']) . "', 
                        no_view ='" . mysql_real_escape_string($wr_no_view) . "', 
                        thumb1='" . mysql_real_escape_string($photo['thumbnails'][0]['url']) . "', 
                        thumb2='" . mysql_real_escape_string($photo['thumbnails'][1]['url']) . "', 
                        thumb3='" . mysql_real_escape_string($photo['thumbnails'][2]['url']) . "',
                        thumb1_width='" . mysql_real_escape_string($photo['thumbnails'][0]['width']) . "', 
                        thumb2_width='" . mysql_real_escape_string($photo['thumbnails'][1]['width']) . "', 
                        thumb3_width='" . mysql_real_escape_string($photo['thumbnails'][2]['width']) . "',
                        thumb1_height='" . mysql_real_escape_string($photo['thumbnails'][0]['height']) . "', 
                        thumb2_height='" . mysql_real_escape_string($photo['thumbnails'][1]['height']) . "', 
                        thumb3_height='" . mysql_real_escape_string($photo['thumbnails'][2]['height']) . "',
                        reg_date = '" . $this->ymdhis . "'
         ");

        return array(mysql_insert_id(), $photo);
    }

    function gp_create_album($album_name, $album_id_file) {
        try {
            $albumEntry = new Zend_Gdata_Photos_AlbumEntry();
            $albumEntry->setTitle($this->picasa->newTitle($album_name));
            $albumEntry = $this->picasa->insertAlbumEntry($albumEntry);
            $album_id = $albumEntry->getGphotoId();
            $fp = fopen($album_id_file, "w");
            fwrite($fp, "<? \$saved = array('album_name'=>'$album_name', 'album_id'=>'$album_id'); ?>");
            fclose($fp);
            return array($album_id, $albumEntry);
        } catch (Exception $e) {
            return array(-1, array());
        }
    }

    function gp_update_summary($album_id, $photo_id, $summary) {
        try {
            $photoQuery = new Zend_Gdata_Photos_PhotoQuery;
            $photoQuery->setUser($this->user);
            $photoQuery->setAlbumId($album_id);
            $photoQuery->setPhotoId($photo_id);
            $photoQuery->setType('entry');
            $photoEntry = $this->picasa->getPhotoEntry($photoQuery);
            if (!$photoEntry)
                return false;
        } catch (Zend_Gdata_App_Exception $e) {
            return false;
        }
        $photoEntry->title->text = $summary;
        $photoEntry->summary->text = $summary;
        $photoEntry->save();
        return true;
    }

    function gp_delete_image($album_id, $photo_id) {
        try {
            $photoQuery = new Zend_Gdata_Photos_PhotoQuery;
            $photoQuery->setUser($this->user);
            $photoQuery->setAlbumId($album_id);
            $photoQuery->setPhotoId($photo_id);
            $photoQuery->setType('entry');
            $entry = $this->picasa->getPhotoEntry($photoQuery);
            $this->picasa->deletePhotoEntry($entry, true);
            return true;
        } catch (Zend_Gdata_App_Exception $e) {
            return false;
        }
    }

}
?>
