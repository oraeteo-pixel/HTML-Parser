<?
/**
 * 소셜로그인(Social Login) - 트위터
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

include_once 'class.lusl.php';

class LUSLTwitter extends LUSL
{
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

    include_once $this->plugin_path.DS.'lib'.DS.'twitter'.DS.'twitteroauth.php';

		$twitteroauth = new TwitterOAuth($this->plugin_config['tw_consumer_key'], $this->plugin_config['tw_consumer_secret']);

		$request_token = $twitteroauth->getRequestToken();

		set_session('oauth_token', $request_token['oauth_token']);
		set_session('oauth_token_secret', $request_token['oauth_token_secret']);

		if($md == 'connect') set_session('oauth_md', 'connect');
		else set_session('oauth_md', false);

		if ($twitteroauth->http_code == 200) {
			$url = $twitteroauth->getAuthorizeURL($request_token['oauth_token']);
			goto_url($url);
		} else {
			alert('소셜로그인 : 트위터 로그인에 실패하였습니다.', $this->getRedirectUrl());
		}
	}

	function callback()
	{
		extract($GLOBALS); extract($_POST); extract($_GET);

		$oauth_token = get_session('oauth_token');
		$oauth_token_secret = get_session('oauth_token_secret');
		$oauth_md = get_session('oauth_md');

		if (!empty($_GET['oauth_verifier']) && !empty($oauth_token) && !empty($oauth_token_secret) ) {

			include_once $this->plugin_path.DS.'lib'.DS.'twitter'.DS.'twitteroauth.php';

			$twitteroauth = new TwitterOAuth($this->plugin_config['tw_consumer_key'], $this->plugin_config['tw_consumer_secret'], $oauth_token, $oauth_token_secret);

			$access_token = $twitteroauth->getAccessToken($_GET['oauth_verifier']);

			set_session('access_token', $access_token);

			$user_info = $twitteroauth->get('account/verify_credentials');
			
			if (isset($user_info->errors)) {
				alert('소셜로그인 : 트위터 로그인에 실패하였습니다\n-CODE : '.$user_info->errors[0]->code.'\n-MSG : ' . $user_info->errors[0]->message.')', $this->getRedirectUrl() );
			} else {
				$uid = $user_info->id;
				$username = $user_info->name;
				$nick = $user_info->screen_name;
				$homepage = $user_info->url;

				$su = $this->getSocialUser('TW', $uid);
				$social_user = array('type'=>'TW', 'name'=>$username, 'nickname'=>$nick, 'social_id'=>$uid, 'homepage'=>$homepage);

				set_session('sses_social_user', $social_user);

				if($oauth_md == 'connect') $this->connect_proc();
				else if($su) $this->login_proc();
				else goto_url(GP_URL.'/do.php?id='.$this->id.'&act=sociallogin&s=signup_proc');
			}

		} else {
			alert('소셜로그인 : 트위터 로그인에 실패하였습니다 (CODE : 101)', $this->getRedirectUrl());
		}
	}
}
?>
