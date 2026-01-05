<?
/**
 * 소셜로그인(Social Login) - 미투데이
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

include_once 'class.lusl.php';

class LUSLMe2day extends LUSL
{
  var $api_url = '';
  var $api_key = '';
  var $callback_url = '';

  function __construct()
  {
    parent::__construct();
    $this->api_key = trim($this->plugin_config['m2_api_key']);
    $this->api_url = 'http://me2day.net/api/get_auth_url.xml?akey='.$this->api_key;
    $this->callback_url = GP_URL.'/do.php?id='.$this->plugin_id.'&act=sociallogin&s=callback_me2day';
  }

	function login()
	{
		$this->_redirect('login');
	}

	function connect()
	{
		$this->_redirect('connect');
	}

	function _redirect($md = 'login')
	{
		extract($GLOBALS); extract($_POST); extract($_GET);

    list($stat, $header, $res) = gp_http_get($this->api_url);

    if($md == 'connect') set_session('oauth_m2_md', 'connect');
    else set_session('oauth_m2_md', false);

		if ($stat == 200) {
      $url = $this->_markup_txt('url', $res);
			goto_url($url);
		} else {
			alert('소셜로그인 : 미투데이로그인에 실패하였습니다.', $this->getRedirectUrl());
		}
	}

  function _markup_txt($tag = '', $str = '')
  {
    preg_match("/<$tag>(.*?)<\/$tag>/i", $str, $m);
    if(!empty($m)) return $m[1];
    else return '';
  }

	function callback()
	{
    $auth_token = $_REQUEST['token'];
    $auth_result = ($_REQUEST['result'] == 'true');
    $auth_user_id = $_REQUEST['user_id'];
    $auth_user_key = $_REQUEST['user_key'];

    list($stat, $header, $res) = gp_http_get("http://me2day.net/api/get_person/".$auth_user_id);
  
    $nickname = $this->_markup_txt('nickname', $res);
    $profile_img_url = $this->_markup_txt('face', $res);
    $email = $this->_markup_txt('email', $res);
		$oauth_md = get_session('oauth_m2_md');

    if(isset($auth_token) && isset($auth_result) && $auth_result == "true") 
    {
				$su = $this->getSocialUser('M2', $auth_user_id);
				$social_user = array('type'=>'M2', 'name'=>$nickname, 'nickname'=>$nickname, 'social_id'=>$auth_user_id, 'email'=>$email);
				set_session('sses_social_user', $social_user);

				if($oauth_md == 'connect') $this->connect_proc();
				else if($su) $this->login_proc();
				else goto_url(GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=signup_proc');

		} else {
			alert('소셜로그인 : 미투데이 로그인에 실패하였습니다 (CODE : 101)', $this->getRedirectUrl());
		}
	}
}
?>
