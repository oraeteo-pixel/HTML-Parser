<?php
/**
 * 플리커 검색 플러그인
 *
 * @package net.lovelyus.g5.plugin.flickr_search
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license CC BY-NC-ND http://creativecommons.org/licenses/by-nc-nd/3.0/deed.ko
 * @link http://lovelyus.net
 */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 


$luFlickrSearch = new LUFlickrSearch();
$luFlickrSearch->hook($gp_scope);


/**
 * LUFlickrSearch : 플리커 검색 클래스
 * 
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license CC BY-NC-ND http://creativecommons.org/licenses/by-nc-nd/3.0/deed.ko
 * @link http://lovelyus.net
 */
final class LUFlickrSearch
{
  var $id;
  var $scope;
  var $plugin_url;
  var $plugin_path;
  var $plugin_config;
  var $config_file = 'cfg.plugin.flickr_search';
  var $do_url;

  /**
   * hook : gpf 후킹
   * 
   * @access public
   * @return void
   */
	function hook($gp_scope)
	{ 
    global $bo_table, $wr_id;

		$this->scope = $gp_scope;
		$this->id = gp_plugin_id(__FILE__);
    $this->plugin_path = dirname(__FILE__);
    $this->plugin_url = gp_plugin_url(__FILE__);
		$this->plugin_config = gp_read_config($this->config_file, array('apikey'=>'', 'search_rows'=>15, 'license'=>3), $this->scope);

    if(!$this->plugin_config['search_rows']) $this->plugin_config['search_rows'] = 15;

    if(!isset($this->plugin_config['license'])) $this->plugin_config['license'] = 0;
    else if(in_array(0, $this->plugin_config['license'])) $this->plugin_config['license'] = 0;
    else $this->plugin_config['license'] = implode(',', $this->plugin_config['license']);

		$this->do_url = GP_URL . '/do.php?scope='.$this->scope.'&bo_table='.$bo_table.'&wr_id='.$wr_id.'&id='.$this->id.'&act=flickr_call';

		gp_add_action("sl_view_content_top", array($this, "on_view_content_top"));
		gp_add_action("pre_view", array($this, "on_load_flickr_image"));
		gp_add_action("pre_write", array($this, "on_load_flickr_image"));
		gp_add_action("post_write_update", array($this, "on_write_update"));
		gp_add_action('post_delete.tail', array($this, 'on_delete'));
		gp_add_action('post_delete_all.tail', array($this, 'on_delete'));
		gp_add_action("px_flickr_call", array($this, "on_px"));
		gp_add_action("px_flickr_search", array($this, "on_search"));
		gp_add_filter('sl_write_items', array($this, 'sl_flickr_form')); 
		gp_add_filter('sl_css_style', array($this, 'plugin_css'));
		gp_add_action('pre_list', array($this, 'on_list'));
		gp_add_action('sl_list_icons', array($this, 'list_icons'));

		gp_add_filter('gpa_settings', array($this, 'plugin_setting'), 10);
		gp_add_action('pxa_flickr_save_setting', array($this, 'plugin_save_setting'));
		gp_add_filter('gpa_menu_plugin_'.$this->id, array($this, 'plugin_menu'));
		gp_add_action('pxa_flickr_install', array($this, 'plugin_install'));
		gp_add_action('pxa_flickr_uninstall', array($this, 'plugin_uninstall'));

		gp_add_filter('gp_board_thumb', array($this, 'sl_flickr_thumb'), 10, 7);	// 목록에 아이콘 추가
	}

	function sl_flickr_thumb($thumb, $bo_table, $wr_id, $wr_content, $wr_files, $thumb_width, $thumb_height)
	{
		global $list;
		if($thumb) return $thumb;

		if(isset($list))
		{
			foreach($list as $row)
			{
				if($row['wr_id'] == $wr_id)
				{
					if(!empty($row['flickr'])) return $row['flickr']['img_source'];
					break;
				}
			}
		}

		if(!empty($view['flickr']))
		{
			return $view['flickr']['img_source'];
		}
		return $thumb;
	}
  /**
   * 글 등록시, 플리커 이미지도 등록
   * 
   * @access public
   * @return void
   */
  function on_write_update()
  {
    global $bo_table, $wr_id, $member, $write, $fkr_img_title, $fkr_img_url, $fkr_width, $fkr_height, $fkr_owner_name, $fkr_owner_url, $fkr_img_source, $fkr_license;


    sql_query("DELETE FROM sl_flickr WHERE bo_table='{$bo_table}' AND wr_id='{$wr_id}'");

    if(!$fkr_img_url) return;
    sql_query("INSERT INTO sl_flickr SET 
                    bo_table='{$bo_table}', 
                    wr_id='{$wr_id}', 
                    wr_subject='".mysql_real_escape_string($write['wr_subject'])."', 
                    mb_id='{$member['mb_id']}', 
                    img_title='{$fkr_img_title}', 
                    img_url='{$fkr_img_url}', 
                    img_source='{$fkr_img_source}', 
                    width='{$fkr_width}', 
                    height='{$fkr_height}', 
                    owner_name='{$fkr_owner_name}', 
                    owner_url='{$fkr_owner_url}', 
                    license='{$fkr_license}', 
                    reg_date='".G5_TIME_YMDHIS."'"
    );
  }

  /**
   * 게시글 삭제, 선택 삭제시
   * 
   * @access public
   * @return void
   */
  function on_delete()
  {
		global $bo_table, $wr_id, $tmp_array;
		$wr_ids = array();
		if($wr_id) array_push($wr_ids, $wr_id);
		if($tmp_array) $wr_ids = $tmp_array;

		$where_in = ' wr_id in (';
		$wr_indexer = array();

		for($i=0, $to=count($wr_ids); $i<$to; $i++)
		{
			$where_in .= " {$wr_ids[$i]}, ";
		}
		$where_in .= " -1)";

		sql_query("DELETE FROM sl_flickr WHERE bo_table = '$bo_table' AND $where_in ");
  }
  
  /**
   * 검색 (ajax call 응답)
   * 
   * @access public
   * @return void
   */
  function on_search()
  {
    global $stx, $page, $sort, $id;

    if($this->id != $id) return;
     
    if(!trim($stx)) die( json_encode( array('code'=>-1, 'msg'=>'검색어를 입력하세요') ) );
    if(!$page) $page = 1;

    include_once $this->plugin_path.DS.'phpFlickr-3.1'.DS.'phpFlickr.php';

    $f = new phpFlickr($this->plugin_config['apikey']);
    $photos = $f->photos_search(array("tags"=>$stx, "tag_mode"=>"any", "page"=>$page, "per_page"=>$this->plugin_config['search_rows'], "license"=>"{$this->plugin_config['license']}", "extras"=>"owner_name,license,url_sql,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l,url_o,views", "sort"=>$sort));
    $ret = array();
    foreach ($photos['photo'] as $photo) {
        $photo['title'] = cut_str($photo['title'], '40');
        array_push($ret, $photo);
    }
    unset($photos['photo']);
    die( json_encode( array('code'=>1, 'list'=>$ret, 'info'=>$photos) ) );
  }

  /**
   * 글쓰기 폼 항목 추가
   * 
   * @param mixed $items 
   * @access public
   * @return void
   */
	function sl_flickr_form($items)
	{
		 array_push($items, array('head'=>'이미지검색', 'td_render'=>array($this, 'sl_flickr_form_print'), 'content_render'=>array($this, 'sl_flickr_form_print'), 'order'=>85));
		 return $items;
	}

  /**
   * 글쓰기 폼
   * 
   * @access public
   * @return void
   */
	function sl_flickr_form_print()
	{
		global $bo_table, $wr_id, $fkr;
    $scope = $this->scope;
    $plugin_url = $this->plugin_url;
    $plugin_id = $this->id;

		if(!$this->plugin_config['apikey'])
		{
			echo '<div style="margin:5px;padding:10px;border:1px solid red;background-color:#fffbfe;color:red;">플리커 계정을 설정하신 후 사용하세요. <a href="'.gp_url(GP_ADMIN_URL.'/setting.php', $this->scope, false, $this->id).'">[설정하기]</a></div>';
			return;
		}
		include_once $this->plugin_path.'/tpl/write.form.php';
	}

  /**
   * view, write 페이지에서 등록된 플리커 이미지 로드
   * 
   * @access public
   * @return void
   */
  function on_load_flickr_image()
  {
    global $bo_table, $wr_id;
    $GLOBALS['fkr'] = sql_fetch("SELECT * FROM sl_flickr WHERE bo_table = '$bo_table' AND wr_id = '$wr_id'");
  }

  /**
   * 뷰의 컨텐츠 상단에 출력
   * 
   * @access public
   * @return void
   */
  function on_view_content_top()
  {
    global $fkr;
    if($fkr['img_source'])
    {
      $cc_by = '<img src="'.$this->plugin_url.'/imgs/cc_by.gif" border="0" align="absmiddle"/>';
      $cc_nc = '<img src="'.$this->plugin_url.'/imgs/cc_nc.gif" border="0" align="absmiddle"/>';
      $cc_nd = '<img src="'.$this->plugin_url.'/imgs/cc_nd.gif" border="0" align="absmiddle"/>';
      $cc_sa = '<img src="'.$this->plugin_url.'/imgs/cc_sa.gif" border="0" align="absmiddle"/>';
      $img_license = array('0'=>'', '1'=>$cc_by.$cc_nc.$cc_sa, '2'=>$cc_by.$cc_nc, '3'=>$cc_by.$cc_nc.$cc_nd, '4'=>$cc_by, '5'=>$cc_by.$cc_sa, '6'=>$cc_by.$cc_nd); 
      $curl = 'http://creativecommons.org/licenses/';
      $license_tag= array('0'=>'', '1'=>'by-nc-sa', '2'=>'by-nc', '3'=>'by-nc-nd', '4'=>'by', '5'=>'by-sa', '6'=>'by-nd');
      if($fkr['license'] > 0) {
        $license = '<a href="'.$curl.$license_tag[$fkr['license']].'/2.0/deed.ko" target="_blank">'.$img_license[$fkr['license']].'</a>';
      }
      else $license = '';
    ?>
      <div id="fkr_image">
        <a href="<?php echo $fkr['img_url']; ?>" target="_blank">
         <img src="<?php echo $fkr['img_source'];?>" title="<?php echo htmlspecialchars($fkr['img_title']);?>" border="0" id="fkr_thumb"/>
        </a>
        <div class="fkr_image_description">
          <div class="fkr_image_license"><?php echo $license; ?></div>
          <div class="fkr_image_caption">
            <!-- <span class="fkr_image_title"><?php echo $fkr['img_title'];?></span> -->
            by 
            <a href="<?php echo $fkr['owner_url'];?>" target="_blank"><?php echo $fkr['owner_name'];?></a>
          </div>
        </div>
      </div>
      <script type="text/javascript">
        $(document).ready(function() {
          setTimeout(function() {
            var $fkr_frame = $('#fkr_image');
            var $fkr_thumb = $('#fkr_thumb');
            if($fkr_frame.width() < $fkr_thumb.width())
            {
              $fkr_thumb.css('width', '98%');
            }
          }, 500);
        });
      </script>
    <?php
    }
  }

  /**
   * 목록보기에서 리스트에 플리커 정보 할당 
   * 
   * @access public
   * @return void
   */
  function on_list()
  {
		global $list, $bo_table;
		$where_in = ' wr_id in (';
		$wr_indexer = array();
		for($i=0, $to=count($list); $i<$to; $i++)
		{
			$where_in .= " {$list[$i]['wr_id']}, ";
			$wr_indexer[$list[$i]['wr_id']] = $i;
		}
		$where_in .= " -1)";
		$res = sql_query("SELECT * FROM sl_flickr WHERE bo_table = '$bo_table' AND $where_in");
		while($row = sql_fetch_array($res))
		{
			$idx = $wr_indexer[$row['wr_id']];
			unset($row['bo_table']); unset($row['wr_id']);
			$list[$idx]['flickr'] = $row;
		}
    $GLOBALS['list'] = $list;
  }

  /**
   * 플리커 이미지가 있을 경우, 아이콘 출력
   * 
   * @param mixed $row 
   * @access public
   * @return void
   */
  function list_icons($row)
  {
		if($row['flickr']) {
			echo '&nbsp;<img src="'.$this->plugin_url.'/imgs/flickr-icon.png" border="0" align="absmiddle"/>';
		}
  }

  /**
   * CSS 추가
   * 
   * @param mixed $css 
   * @access public
   * @return void
   */
	function plugin_css($css)
  {
    $css .='
/* view */
div#fkr_image{margin:0 auto 30px auto;padding:5px;width:95%;border:1px solid #f0f0f0;text-align:center;overflow:hidden;}
div#fkr_image img{}
div.fkr_image_description{position:relative;;margin-top:10px;color:#ccc;}
div.fkr_image_license{float:left;}
div.fkr_image_caption{float:right;color:#ccc;}
span.fkr_image_title{color:#aaa}
div.fkr_image_caption a{color:#888}
/* write */
section#fkr{position:relative;width:100%;word-break:break-all;overflow:hidden;}
div.fkr_search_bar{position:relative;border:none;padding:5px;overflow:auto}
div.fkr_search_bar_left{position:relative;display:inline-block;color:#aaa;}
img.fkr_loading_img{position:absolute;display:none;margin-top:5px;margin-left:10px;}
div.fkr_search_bar_right{float:right;}
div.skin_l a.fkr_prev_btn{display:none;}
div.skin_l a.fkr_next_btn{display:none;}
div#fkr_results{display:none;margin-top:5px;border-top:1px solid #f0f0f0;}
div.fkr_row{position:relative;min-height:75px;margin-bottom:5px;padding:5px;border-bottom:1px solid #f0f0f0;color:#888;}
div.fkr_img{}
div.fkr_img img{border:0;}
div.fkr_row_content{}
span.fkr_title a{color:#579A78}
span.fkr_owner{}
span.fkr_owner a{color:#4C43BC}
span.fkr_photo_license{margin-right:5px;}
span.fkr_cc_img{position:absolute;margin-top:1px;margin-left:3px;}
span.fkr_size_label{}
div#fkr_img_url_info{display:none;margin:5px;padding:5px;border:1px solid #f0f0f0;}
div.fkr_res_label{position:relative;width:100%;font-weight:bold;}
div.fkr_res_label a{position:absolute;top:0;right:0;font-weight:normal;}
';
    return $css;
  }

  /**
   * 설정페이지에 항목 추가
   * 
   * @param mixed $gpa_settings 
   * @access public
   * @return void
   */
	function plugin_setting($gpa_settings)
	{
		array_push($gpa_settings, array('ID'=>$this->id, 'title'=>'스키넬 플리커', 'print_contents'=>array($this, 'plugin_config_contents'), 'order'=>10) );
		return $gpa_settings;
	}

	
  /**
   * 설정 저장
   * 
   * @access public
   * @return void
   */
	function plugin_save_setting()
	{
    global $id;
    if($this->id != $id) return;

		gp_write_config($this->config_file, gp_strip_slashes($_REQUEST['plugin_config']), $this->scope );
		alert('플리커 검색 플러그인 설정 저장 완료');
	}

	
  /**
   * 플러그인 설정 페이지
   * 
   * @access public
   * @return void
   */
	function plugin_config_contents()
	{
		$plugin_config = $this->plugin_config;
		$plugin_id = $this->id;
		$plugin_path = $this->plugin_path;
		$plugin_url = $this->plugin_url;
		include_once $this->plugin_path."/tpl/config.form.php";
	}

  /**
   * plugins 페이지에 메뉴 추가
   * 
   * @param mixed $menus 
   * @access public
   * @return void
   */
	function plugin_menu($menus)
	{
		global $bo_table;

		if(gp_table_exists('sl_flickr')) 
		{
			if(gp_is_activated($this->id, $this->scope))
			{
				array_push($menus, array('href'=>gp_url('setting.php', $this->scope, $noqm=false, $this->id), 'text'=>'설정'));
			}
			array_push($menus, array('href'=>gp_url('admin_do.php', $this->scope).'&id='.$this->id.'&act=flickr_uninstall', 'attr'=>'onclick="return confirm(\'등록된 모든 플리커 이미지 정보가 삭제됩니다.\\n진행하시겠습니까?\');"', 'text'=>'DB삭제'));
		} else {
			array_push($menus, array('href'=>gp_url('admin_do.php', $this->scope).'&id='.$this->id.'&act=flickr_install', 'text'=>'DB생성', 'attr'=>''));
		}
		return $menus;
	}

	
  /**
   * 플러그인 설치
   * 
   * @access public
   * @return void
   */
	function plugin_install()
	{
    global $id;
    if($this->id != $id) return;

		$install_script =<<<EOF
		CREATE TABLE IF NOT EXISTS `sl_flickr` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `bo_table` varchar(20) NOT NULL,
		  `wr_subject` varchar(255) NOT NULL,
		  `wr_id` int(11) NOT NULL,
		  `mb_id` varchar(255) NOT NULL,
		  `img_title` varchar(255) NOT NULL,
		  `img_url` varchar(255) NOT NULL,
		  `img_source` varchar(255) NOT NULL,
		  `width` int(11) NOT NULL,
		  `height` int(11) NOT NULL,
		  `owner_name` varchar(255) NOT NULL,
		  `owner_url` varchar(255) NOT NULL,
		  `license` int(11) NOT NULL,
		  `reg_date` datetime NOT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;
;
EOF;
		$f = explode(";", $install_script);
		for ($i=0; $i<count($f); $i++) {
			if (trim($f[$i]) == "") continue;
			sql_query($f[$i]);
		}
		goto_url(gp_url('plugins.php', $this->scope));
	}

	
  /**
   * 플러그인 제거
   * 
   * @access public
   * @return void
   */
	function plugin_uninstall()
	{
    global $id;
    if($this->id != $id) return;
		sql_query("DROP TABLE sl_flickr", false);
		gp_deactivate_plugin($this->id, $this->scope);
		goto_url(gp_url('plugins.php', $this->scope));
	}
}
?>
