<?php
/**
 * 알리미 플러그인 
 *
 * @package net.lovelyus.g5.plugin.pushmsg
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

define('PUSHMSG_CONFIG_FILE', 'cfg.plugin.pushmsg.php');

$luPushmsg = new LUPushmsg();
$luPushmsg->hook($gp_scope);


function psm_unreads() 
{
  global $member;
  $res = sql_query("SELECT * FROM gpf_pushmsg WHERE receiver='{$member['mb_id']}' AND checked IS NULL ");
  $info = array('total'=>0, 'reply'=>0, 'comment'=>0, 'comment_reply'=>0, 'memo'=>0, 'list'=>array());
  $info['push_list_link'] = GP_URL.'/do.php?id='.gp_plugin_id(__FILE__).'&act=psm_list';
  while($row = sql_fetch_array($res))
  {
    $info[$row['push_type']]++;
    $info['total']++;

    $row['prop'] = $prop = unserialize($row['prop']);
    $time = psm_time_ago($row['reg_date'], 1);
	$seName = $prop['bo_table'];
	if($prop['bo_table']=='madang') $seName = 'md';
	else if($prop['bo_table']=='notice') $seName = 'no';
    switch($row['push_type'])
    {
    case 'reply' : 
      $row['subject'] = '<b>'.$row['sender'].'</b>님이 내 글에 답글을 남기셨습니다.'; 
      $row['link'] = G5_URL.'/_'.$prop['bo_table'].'/?'.$seName.'_id='.$prop['wr_id_from']; 
      break;
    case 'comment' : 
      $row['subject'] = '<b>'.$row['sender'].'</b>님이 내 글에 댓글을 남기셨습니다.'; 
      $row['link'] = G5_URL.'/_'.$prop['bo_table'].'/?'.$seName.'_id='.$prop['wr_id_to'].'&mode=openComment#goto'.$prop['cmt_id_from']; 
      break;
    case 'comment_reply' : 
      $row['subject'] = '<b>'.$row['sender'].'</b>님이 내 댓글에 답댓글을 남기셨습니다.'; 
      $row['link'] = G5_URL.'/_'.$prop['bo_table'].'/?'.$seName.'_id='.$prop['wr_id_to'].'&mode=openComment#goto'.$prop['cmt_id_from']; 	  
      break;
    case 'memo' :
      $row['subject'] = '<b>'.$row['sender'].'</b>님으로부터 쪽지가 도착했습니다.';
      $row['link'] = G5_BBS_URL.'/memo_view.php?me_id='.$prop['me_id'].'&kind=recv';
      break;
    default:
      $row['subject'] = gp_do_filter('pushmsg_subj', $row);
      $row['link'] = gp_do_filter('pushmsg_link', $prop);
    break;
    }
    array_push($info['list'], $row);
  }
  return $info;
}

function psm_time_ago($date,$granularity=2) {
  $date = strtotime($date);
  $difference = time() - $date;
  $periods = array(
    '십년' => 315360000,
    '년' => 31536000,
    '월' => 2628000,
    '주' => 604800, 
    '일' => 86400,
    '시간' => 3600,
    '분' => 60,
    '초' => 1);
  foreach ($periods as $key => $value) {
    if ($difference >= $value) {
      $time = floor($difference/$value);
      $difference %= $value;
      $retval .= ($retval ? ' ' : '').$time.'';
      $retval .= (($time > 1) ? $key.'' : $key);
      $granularity--;
    }
    if ($granularity == '0') { break; }
  }
  return $retval.' 전';      
}

/**
 * 
 * 
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
class LUPushmsg
{
  var $id;
  var $scope;
  var $plugin_url;
  var $plugin_path;
  var $plugin_config;
  var $config_file = PUSHMSG_CONFIG_FILE;
  var $do_url;

  /**
   * hook : gpf 후킹
   * 
   * @access public
   * @return void
   */
	function hook($gp_scope)
	{ 
		$this->scope = $gp_scope;
		$this->id = gp_plugin_id(__FILE__);
    $this->plugin_path = dirname(__FILE__);
    $this->plugin_url = gp_plugin_url(__FILE__);
		$this->plugin_config = gp_read_config($this->config_file, array('uid'=>'mb_id'), $this->scope);

    define('PUSHMSG_UID', $this->plugin_config['uid']);

		$this->do_url = GP_URL . '/do.php?id='.$this->id.'&act=';

		gp_add_filter('gpa_menu_plugin_'.$this->id, array($this, 'plugin_menu'));
		gp_add_filter('gpa_settings', array($this, 'plugin_setting'), 10);
		gp_add_action('pxa_psm_save_setting', array($this, 'plugin_save_setting'));
		gp_add_action('pxa_psm_install', array($this, 'plugin_install'));
		gp_add_action('pxa_psm_uninstall', array($this, 'plugin_uninstall'));

    if(basename($_SERVER['SCRIPT_NAME']) == 'memo_form_update.php') set_session('gpf_pushmsg_memo_updated', true);

    gp_add_action('post_write_update', array($this, 'on_write_update'));
    gp_add_action('post_write_comment_update', array($this, 'on_write_comment_update'));
    gp_add_action('post_memo', array($this, 'on_memo'));


    foreach(glob($this->plugin_path."/pages/*.php") as $file)
    {
      $filename = basename($file);
      if($filename{0} == '_') continue;
      $px = str_replace('.php', '', $filename);
      gp_add_action('px_psm_'.$px, array($this, 'on_px'));
    }
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
		array_push($gpa_settings, array('ID'=>$this->id, 'title'=>'알리미', 'print_contents'=>array($this, 'plugin_config_contents'), 'order'=>10) );
		return $gpa_settings;
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
		alert('알리미 플러그인 설정 저장 완료');
	}

  function on_px()
  {
    global $id;
    if($this->id != $id) return;

    extract($GLOBALS);
    if($is_guest) alert('로그인 후 사용하세요');
    $scope = $this->scope;
    $plugin_id = $this->id;
    $plugin_path = $this->plugin_path;
    $plugin_url = $this->plugin_url;
    $plugin_config = $this->plugin_config;
		$px_url = GP_URL . '/do.php?id='.$this->id;
    $inc_file = $this->plugin_path.DS.'pages'.DS.basename(str_replace('psm_', '', $act)).'.php'; 
    if(!file_exists($inc_file)) {
      gp_alert('알리미 : 잘못된 접근');
    }
    include_once $inc_file;
  }

  function on_memo()
  {
    global $list, $kind, $member;

    $sess = get_session('gpf_pushmsg_memo_updated');
    set_session('gpf_pushmsg_memo_updated', false);

    if($kind != 'send' || empty($list) || !$sess) return;

    foreach($list as $item)
    {
      if(substr($item['me_read_datetime'], 0, 1) != 0) continue;
      $mb = get_member($item['me_send_mb_id']);
      $sender = $mb[PUSHMSG_UID];
      $receiver = $item['me_recv_mb_id'];
      $me_id = $item['me_id'];
      $prop = serialize(compact('me_id'));
      if(sql_fetch("SELECT id FROM gpf_pushmsg WHERE push_type='memo' AND prop='{$prop}'")) continue;

      sql_query("INSERT INTO gpf_pushmsg SET
        push_type = 'memo'
        ,sender = '{$sender}'
        ,receiver = '{$receiver}'
        ,prop = '{$prop}'
        ,reg_date = '".G5_TIME_YMDHIS."'
       ");
      }
  }

  function on_write_update()
  {
    global $w, $bo_table, $wr_id, $wr_name, $write, $member;
    if($w != 'r' || !$write['mb_id']) return;
    $sender = ($member[PUSHMSG_UID] ? $member[PUSHMSG_UID] : $wr_name);
    $receiver = $write['mb_id'];

    if($member['mb_id'] == $receiver) return;

    $wr_id_from = $_POST['wr_id'];
    $wr_id_to = $wr_id;

    $prop = serialize(compact('bo_table', 'wr_id_from', 'wr_id_to'));

    sql_query("INSERT INTO gpf_pushmsg SET
      push_type = 'reply'
      ,sender = '{$sender}'
      ,receiver = '{$receiver}'
      ,prop = '{$prop}'
      ,reg_date = '".G5_TIME_YMDHIS."'
     ");
  }

  function on_write_comment_update()
  {
    global $w, $bo_table, $member, $comment_id, $write, $write_table, $wr_name;

    if($w != 'c') return;

    $mb_id_to = '';

    // comment reply
    if($_POST['comment_id']) 
    {
      $type = 'comment_reply';
      $reply = sql_fetch("select mb_id from $write_table where wr_id = '{$_POST['comment_id']}' ");
      $receiver = $reply['mb_id'];
    } else {
      $type = 'comment';
      $receiver = $write['mb_id'];
    }

    if(!$receiver) return;

    $sender = ($member[PUSHMSG_UID] ? $member[PUSHMSG_UID] : $wr_name);

    if($member['mb_id'] == $receiver) return;

    $wr_id_to = $_POST['wr_id'];
    $cmt_id_to = $_POST['comment_id'];
    $cmt_id_from = $comment_id;

    $prop = serialize(compact('bo_table', 'wr_id_to', 'cmt_id_to', 'cmt_id_from'));

    sql_query("INSERT INTO gpf_pushmsg SET
      push_type = '{$type}'
      ,sender = '{$sender}'
      ,receiver = '{$receiver}'
      ,prop = '{$prop}'
      ,reg_date = '".G5_TIME_YMDHIS."'
     ");
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

		if(gp_table_exists('gpf_pushmsg')) 
		{
      array_push($menus, array('href'=>gp_url('setting.php', $this->scope, $noqm=false, $this->id), 'text'=>'설정'));

			array_push($menus, array('href'=>gp_url('admin_do.php', $this->scope).'&id='.$this->id.'&act=psm_uninstall', 'attr'=>'onclick="return confirm(\'등록된 모든 DB 정보가 삭제됩니다.\\n진행하시겠습니까?\');"', 'text'=>'DB삭제'));

      $res = sql_query("SHOW COLUMNS FROM gpf_pushmsg");
      while ($row = sql_fetch_array($res)) {
        if($row['Field'] == 'push_type' && strpos($row['Type'], 'enum') !== false)
        {
          sql_query("ALTER TABLE gpf_pushmsg CHANGE push_type push_type VARCHAR(20) NOT NULL");
          break;
        }
      }
		} else {
			array_push($menus, array('href'=>gp_url('admin_do.php', $this->scope).'&id='.$this->id.'&act=psm_install', 'text'=>'DB생성', 'attr'=>''));
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
		CREATE TABLE IF NOT EXISTS gpf_pushmsg (
      id INT NOT NULL AUTO_INCREMENT,
      push_type VARCHAR(20) NOT NULL,
      sender VARCHAR(50) NOT NULL,
      receiver VARCHAR(50) NOT NULL,
      prop VARCHAR(255) NOT NULL,
      checked BOOL NULL,
      reg_date DATETIME NULL,
      PRIMARY KEY(id)
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

		sql_query("DROP TABLE gpf_pushmsg", false);
		gp_deactivate_plugin($this->id, $this->scope);
		goto_url(gp_url('plugins.php', $this->scope));
	}
}
?>
