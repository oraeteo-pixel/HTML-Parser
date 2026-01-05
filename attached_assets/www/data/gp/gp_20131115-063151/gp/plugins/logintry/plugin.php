<?php
/**
 * 로그인시도 알리미 플러그인 
 *
 * @package net.lovelyus.g5.plugin.logintry
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

$luLogintry = new LULogintry();
$luLogintry->hook($gp_scope);

/**
 * 
 * 
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
class LULogintry
{
  var $id;
  var $scope;
  var $plugin_url;
  var $plugin_path;
  var $plugin_config;
  var $config_file = 'cfg.plugin.logintry.php';
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
		$this->plugin_config = gp_read_config($this->config_file, array('logintry_times'=>5, 'login_retry_minute'=>10), $this->scope);
		$this->do_url = GP_URL . '/do.php?scope='.$this->scope.'&bo_table='.$bo_table.'&wr_id='.$wr_id.'&id='.$this->id.'&act=';

		gp_add_filter('gpa_settings', array($this, 'plugin_setting'), 10);
		gp_add_action('pxa_logintry_save_setting', array($this, 'plugin_save_setting'));
		gp_add_filter('gpa_menu_plugin_'.$this->id, array($this, 'plugin_menu'));
		gp_add_action('pxa_logintry_install', array($this, 'plugin_install'));
		gp_add_action('pxa_logintry_uninstall', array($this, 'plugin_uninstall'));
    gp_add_action('gp_plugin_loaded', array($this, 'on_loaded'));
    gp_add_action('px_logintry_list', array($this, 'on_list'));
	}

  /**
   * 사이트 상단에 메시지 출력
   * 
   * @param string $msg 
   * @access protected
   * @return void
   */
  function _alert($msg='')
  {
    $this->alert_msg = $msg;
    gp_add_action('head_script', array($this, '_alert_script'));
  }

  /**
   * 사이트 상단에 메시지 출력
   * 
   * @access protected
   * @return void
   */
  function _alert_script()
  {
  ?>
    <script type="text/javascript">
    $(document).ready(function() {
      $('body').prepend([
        '<div style="margin:auto;padding:10px;background-color:#222;color:#ffff00;text-align:center;">',
        ' <?php echo addslashes($this->alert_msg); ?>',
        '</div>'
        ].join(''));
    });
    </script>
  <?php
  }

  /**
   * 페이지 로딩 시 마다 실행
   * 
   * @access public
   * @return void
   */
  function on_loaded()
  {
    if(basename($_SERVER['SCRIPT_NAME']) == 'login_check.php' && getcwd() == realpath(G5_BBS_PATH))
    {
      $this->on_login_check();
      return;
    }

    $sess = get_session('sess_logintry');
    if(!$sess) return;

    $this->_alert('로그인 시도가 있었습니다 : <a href="'.GP_URL.'/do.php?id='.$this->id.'&act=logintry_list" style="color:#ffffff">확인하기</a>');
  }

  /**
   * login_check.php 호출 시 
   * 
   * @access public
   * @return void
   */
  function on_login_check()
  {
    $mb_id       = escape_trim($_POST['mb_id']);
    $mb_password = escape_trim($_POST['mb_password']);

    $where_common = " mb_id = '{$mb_id}' AND ip = '{$_SERVER['REMOTE_ADDR']}' ";

    if (!trim($mb_id) || !trim($mb_password)) return;

    $expire_date = date("Y-m-d h:i:s", G5_SERVER_TIME - ($this->plugin_config['login_retry_minute'] * 60));
    $locked = sql_fetch(" SELECT * FROM gpf_logintry WHERE $where_common AND stat='locked'");

    if($locked)
    { 
      // lock and login fail
      if($locked['reg_date'] > $expire_date) {
        alert($this->plugin_config['login_retry_minute'].'분 동안 로그인 하실 수 없습니다.');
        exit;
      } else {
        // unlock and pass
        sql_query(" UPDATE gpf_logintry SET stat = 'unlocked', update_date = '".G5_TIME_YMDHIS."' WHERE $where_common AND stat='locked' ");
      }
    } 

    $mb = get_member($mb_id);

    // 로그인 실패
    if (!$mb['mb_id'] || (sql_password($mb_password) != $mb['mb_password'])) {

      // 로그인 실패 횟수 검사
      $ex = sql_fetch("SELECT count(id) as cnt FROM gpf_logintry WHERE $where_common AND stat = 'tried'");

      // 초과 실패시
      if($ex['cnt']+1 >= $this->plugin_config['logintry_times'])
      {
        sql_query("
          INSERT INTO gpf_logintry SET
           mb_id = '{$mb_id}'
           ,ip = '{$_SERVER['REMOTE_ADDR']}'
           ,stat = 'locked'
           ,update_date = '".G5_TIME_YMDHIS."'
           ,reg_date = '".G5_TIME_YMDHIS."'
        ");
        sql_query("UPDATE gpf_logintry SET stat = 'tried and locked', update_date = '".G5_TIME_YMDHIS."' WHERE $where_common AND stat = 'tried'");

        alert(($ex['cnt']+1).'번 로그인에 실패하였습니다.\n'.$this->plugin_config['login_retry_minute'].'분 동안 로그인 하실 수 없습니다.');
        exit;

      } else {

        // 시도횟수 제한 이내
        sql_query("
          INSERT INTO gpf_logintry SET
           mb_id = '{$mb_id}'
           ,ip = '{$_SERVER['REMOTE_ADDR']}'
           ,stat = 'tried'
           ,update_date = '".G5_TIME_YMDHIS."'
           ,reg_date = '".G5_TIME_YMDHIS."'
        ");
        alert(($ex['cnt']+1).'번 로그인에 실패하였습니다.\n'.$this->plugin_config['logintry_times'].'번 실패 시 계정이 잠깁니다.');
        exit;
      }
    
    // 로그인 성공 시
    } else {

      // 로그인 사용자에게 로그 리포트
      $ex = sql_fetch("SELECT count(id) as cnt FROM gpf_logintry WHERE mb_id = '{$mb_id}' AND ( stat = 'tried' OR stat = 'locked' OR stat = 'tried and locked' ) AND reported = 0 ");

      if($ex['cnt'] > 0) {
        set_session('sess_logintry', true);
      }

      // 로그인 로그 기록
      sql_query("
        INSERT INTO gpf_logintry SET
         mb_id = '{$mb_id}'
         ,ip = '{$_SERVER['REMOTE_ADDR']}'
         ,stat = 'loged in'
         ,update_date = '".G5_TIME_YMDHIS."'
         ,reg_date = '".G5_TIME_YMDHIS."'
      ");

      // 이 아이피에서 로그인 실패하다가 로그인 한 경우, tried and loged in 으로 상태 변경
      sql_query("UPDATE gpf_logintry SET stat = 'tried and loged in', update_date = '".G5_TIME_YMDHIS."' WHERE $where_common AND stat = 'tried'");
    }
  }

  /**
   * 로그인 로그 목록
   * 
   * @return void
   */
  function on_list()
  {
    if($this->id != $_REQUEST['id']) return;
    extract($GLOBALS);
    include_once $this->plugin_path.DS.'tpl'.DS.'list.php';
    exit;
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
		array_push($gpa_settings, array('ID'=>$this->id, 'title'=>'로그인시도 알리미', 'print_contents'=>array($this, 'plugin_config_contents'), 'order'=>10) );
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
    if($this->id != $_REQUEST['id']) return;

		gp_write_config($this->config_file, gp_strip_slashes($_REQUEST['plugin_config']), $this->scope );
		alert('로그인시도 알리미 플러그인 설정 저장 완료');
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

		if(gp_table_exists('gpf_logintry')) 
		{
		  array_push($menus, array('href'=>gp_url('setting.php', $this->scope, $noqm=false, $this->id), 'text'=>'설정'));
			array_push($menus, array('href'=>gp_url('admin_do.php', $this->scope).'&id='.$this->id.'&act=logintry_uninstall', 'attr'=>'onclick="return confirm(\'등록된 모든 DB 정보가 삭제됩니다.\\n진행하시겠습니까?\');"', 'text'=>'DB삭제'));
		} else {
			array_push($menus, array('href'=>gp_url('admin_do.php', $this->scope).'&id='.$this->id.'&act=logintry_install', 'text'=>'DB생성', 'attr'=>''));
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
    if($this->id != $_REQUEST['id']) return;

		$install_script =<<<EOF
		CREATE TABLE IF NOT EXISTS `gpf_logintry` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `mb_id` varchar(255) NOT NULL,
		  `ip` varchar(20) NOT NULL,
		  `stat` varchar(20) NOT NULL,
		  `reported` boolean NOT NULL DEFAULT 0,
		  `update_date` datetime NOT NULL,
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
    if($this->id != $_REQUEST['id']) return;
    
		sql_query("DROP TABLE gpf_logintry", false);
		sql_query("DROP TABLE gpf_logintry_locked", false);
		gp_deactivate_plugin($this->id, $this->scope);
		goto_url(gp_url('plugins.php', $this->scope));
	}
}
?>
