<?
/**
 * 소셜로그인(Social Login) 플러그인
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

define('SOCIAL_LOGIN_CONFIG_FILE', 'cfg.sociallogin.api.php');

$socialLogin = new LuSocialLogin();
$socialLogin->hook();

/**
 * LuSocialLogin
 *
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 */
class LuSocialLogin
{
    var $id;
    var $plugin_path;
    var $plugin_url;

    /**
     * hook : 이벤트,필터 후킹
     *
     * @access public
     * @return void
     */
    function hook()
    {
        global $member;

        $this->id = gp_plugin_id(__FILE__);
        $this->plugin_path = dirname(__FILE__);
        $this->plugin_url = gp_plugin_url(__FILE__);
        $this->plugin_config = gp_read_config(SOCIAL_LOGIN_CONFIG_FILE, array(), GP_SCOPE_SITE);

        if ('GSU_' == substr($member['mb_id'], 0, 4)) {
            gp_add_action('pre_member_confirm', array($this, 'on_member_confirm'));
            gp_add_action('pre_register_confirm', array($this, 'on_register_confirm'));
        }

        gp_add_action('px_sociallogin', array($this, 'on_px'));

        gp_add_filter('gpa_settings', array($this, 'plugin_setting'), 10);
        gp_add_filter('gpa_menu_plugin_' . $this->id, array($this, 'plugin_menu'));
        gp_add_action('pxa_sol_install', array($this, 'plugin_install'));
        gp_add_action('pxa_sol_uninstall', array($this, 'plugin_uninstall'));
        gp_add_action('pxa_sol_save_setting', array($this, 'plugin_save_setting'));

        $GLOBALS['member']['social'] = get_session('sses_social_user');
        if (realpath(dirname($_SERVER['SCRIPT_FILENAME'])) == G5_BBS_PATH && basename($_SERVER['SCRIPT_FILENAME']) == 'logout.php') {
            $this->logout_social();
        }
    }

    /**
     * DB 업그레이드
     *
     * @since 1.2.4
     */
    function _db_upgrade()
    {
        $res = sql_query("SHOW COLUMNS FROM gpf_social_users");
        while ($row = sql_fetch_array($res)) {
            if ($row['Field'] == 'login_type' && strpos($row['Type'], 'GG') !== false) {
                sql_query("ALTER TABLE gpf_social_users CHANGE login_type login_type varchar(2) NOT NULL");
            }
        }
    }

    /**
     * plugin_menu : 플러그인 목록의 메뉴
     *
     * @param array $menus
     * @access public
     * @return array $menus 플러그인메뉴
     */
    function plugin_menu($menus)
    {
        global $bo_table;

        if (gp_table_exists('gpf_social_users')) {
            if (gp_is_activated($this->id, GP_SCOPE_SITE)) {
                array_push($menus, array('href' => gp_url('setting.php', GP_SCOPE_SITE, $noqm = false, $this->id), 'text' => '설정'));
            }
            array_push($menus, array('href' => gp_url('admin_do.php', GP_SCOPE_SITE) . '&id=' . $this->id . '&act=sol_uninstall', 'attr' => 'onclick="return confirm(\'소셜 로그인을 정보가 삭제됩니다.\\n진행하시겠습니까?\');"', 'text' => 'DB삭제'));
        } else {
            array_push($menus, array('href' => gp_url('admin_do.php', GP_SCOPE_SITE) . '&id=' . $this->id . '&act=sol_install', 'text' => 'DB설치', 'attr' => ''));
        }
        return $menus;
    }

    /**
     * on_member_confirm
     *
     * 소셜로그인 사용자는 패스워드를 확인하지 않음
     *
     * @access public
     * @return void
     */
    function on_member_confirm()
    {
        global $member, $url;

        $sses_su = get_session('sses_social_user');

        if (!$sses_su) return;

        $su = $this->getSocialUserByMbId($member['mb_id']);

        if (!function_exists('secure_form')) {
            goto_url($url . '?mb_id=' . $member['mb_id'] . '&w=u');
            return;
        }

        extract($GLOBALS);
        include_once G5_PATH . "/head.sub.php";
        secure_form('fsocial', true, '', $url);
        ?>
        <!-- fake for HTTP Open SSL Plugin -->
        <form name="fmemberconfirm" action="<?= $url ?>" onsubmit="return fcheck(this);" method="post"></form>
        <form name="fsocial" action="<?php echo $url; ?>" onsubmit="return fcheck(this);" method="post">
            <input type="hidden" name="mb_id" value="<?php echo $member['mb_id']; ?>">
            <input type="hidden" name="w" value="u">
        </form>
        <script type="text/javascript">
            function fcheck(f) {
                return true;
            }
            $(document).ready(function () {
                $('form[name=fsocial]').submit();
            });
        </script>
        <?
        include_once G5_PATH . "/tail.sub.php";
        exit;
    }

    /**
     * on_register_confirm
     *
     * 소셜로그인 사용자는 패스워드를 확인하지 않음
     *
     * @access public
     * @return void
     */
    function on_register_confirm()
    {
        global $member;
        $su = $this->getSocialUserByMbId($member['mb_id']);
        if ($su) {
            $_POST['mb_password'] = $member['mb_password'];
        }
    }

    /**
     * on_px
     *
     * do.php 를 통한 플러그인 실행 dispatch
     *
     * @access public
     * @return void
     */
    function on_px()
    {
        global $id;
        if ($this->id != $id) return;

        $s = $_REQUEST['s'];
        $func = 'px_' . $s;
        if (method_exists($this, $func)) {
            $this->$func();
            return;
        }
        list($mode, $method) = explode('_', $s);
        $module_file = $this->plugin_path . DS . 'inc' . DS . 'class.' . $method . '.php';
        if (file_exists($module_file)) {
            include_once $module_file;
            $class_name = 'LUSL' . ucfirst($method);
            $module = new $class_name();
            if (method_exists($module, $mode)) {
                $module->$mode();
                return;
            }
        }
        alert('소셜로그인 : 잘못된 접근');
    }

    /**
     * px_connect
     *
     * 기존 회원의 소셜 계정 연결
     *
     * @access public
     * @return void
     */
    function px_connect()
    {
        extract($GLOBALS);
        extract($_POST);
        extract($_GET);
        if ($is_guest) alert('로그인 후 사용하실 수 있습니다.', G5_BBS_URL . "/login.php?url=" . $url);
        $types = array('GG' => '구글', 'FB' => '페이스북', 'TW' => '트위터', 'NV' =>'네이버', 'KT'=>'카카오톡');
        $accounts = socialAccount($member['mb_id']);
        if ($accounts) alert('이미 소셜 네트워크 계정이 연결되어있습니다\n(연결된 소셜네트워크 : ' . $types[$accounts[0]['login_type']] . ")", urldecode($url));
        unset($member['social']);
        set_session('sses_social_user', false);
        $plugin_path = $this->plugin_path;
        $plugin_url = $this->plugin_url;
        $social_skin_path = $plugin_path . "/skin";
        $social_skin_url = $plugin_url . "/skin";
        include_once $this->plugin_path . DS . 'skin' . DS . 'connect.skin.php';
    }

    /**
     * px_logout
     *
     * 로그아웃
     *
     * @access public
     * @return void
     */
    function px_logout()
    {
        $this->logout_social();
        $this->logout_proc();
    }


    /**
     * px_signup_proc
     *
     * 회원가입 폼
     *
     * @access public
     * @return void
     */
    function px_signup_proc()
    {
        extract($GLOBALS);
        extract($_POST);
        extract($_GET);
        $social_user = get_session('sses_social_user');
        if (empty($social_user)) {
            alert('소셜로그인 정보가 존재하지 않습니다', $this->getRedirectUrl());
        }
        $plugin_path = $this->plugin_path;
        $plugin_url = $this->plugin_url;
        $social_skin_path = $plugin_path . DS . 'skin';
        $social_skin_url = $plugin_url . '/skin';
        include_once $this->plugin_path . DS . 'skin' . DS . 'signup.skin.php';
    }

    /**
     * px_signup_proc_exe
     *
     * 회원가입 실행
     *
     * @access public
     * @return void
     */
    function px_signup_proc_exe()
    {
        global $g5, $config, $make_gnu_id;

        //if(get_session("ss_mb_reg")) alert('회원으로 등록 하였습니다.', '/');

        $su = get_session('sses_social_user');
        if (!$su) alert('소셜로그인 정보가 존재하지 않습니다');


        include_once(G5_LIB_PATH . '/register.lib.php');
        include_once(G5_LIB_PATH . '/mailer.lib.php');

        if ($make_gnu_id == 1) {
            $mb_id = escape_trim($_POST['mb_id']);
            $mb_password = escape_trim($_POST['mb_password']);
            $mb_password_re = escape_trim($_POST['mb_password_re']);
            $mb_name = escape_trim($_POST['mb_name']);
            $mb_nick = escape_trim($_POST['mb_nick']);
            $mb_email = escape_trim($_POST['mb_email']);

            if ($msg = empty_mb_id($mb_id)) alert($msg, "", true, true); // alert($msg, $url, $error, $post);

            if ($w == '' && !$mb_password) alert('패스워드가 넘어오지 않았습니다.');
            if ($mb_password != $mb_password_re) alert('패스워드가 일치하지 않습니다.');

            if ($msg = empty_mb_name($mb_id)) alert($msg, "", true, true);
            if ($msg = empty_mb_nick($mb_nick)) alert($msg, "", true, true);
            if ($msg = empty_mb_email($mb_email)) alert($msg, "", true, true);
            if ($msg = reserve_mb_id($mb_id)) alert($msg, "", true, true);
            if ($msg = reserve_mb_nick($mb_nick)) alert($msg, "", true, true);
            if ($msg = valid_mb_name($mb_name)) alert($msg, "", true, true);
            if ($msg = valid_mb_nick($mb_nick)) alert($msg, "", true, true);
            if ($msg = valid_mb_email($mb_email)) alert($msg, "", true, true);
            if ($msg = prohibit_mb_email($mb_email)) alert($msg, "", true, true);
            if ($msg = exist_mb_id($mb_id)) alert($msg);
            if ($msg = exist_mb_nick($mb_nick, $mb_id)) alert($msg, "", true, true);
            if ($msg = exist_mb_email($mb_email, $mb_id)) alert($msg, "", true, true);


            $sql = " insert into {$g5['member_table']}
						set mb_id = '$mb_id',
							mb_password = '" . sql_password($mb_password) . "',
							mb_name = '$mb_name',
							mb_nick = '$mb_nick',
							mb_nick_date = '" . G5_TIME_YMD . "',
							mb_email = '$mb_email',
							mb_homepage = '$mb_homepage',
							mb_today_login = '" . G5_TIME_YMDHIS . "',
							mb_datetime = '" . G5_TIME_YMDHIS . "',
							mb_ip = '$_SERVER[REMOTE_ADDR]',
							mb_level = '$config[cf_register_level]',
							mb_login_ip = '$_SERVER[REMOTE_ADDR]'
							";

            // 이메일 인증을 사용하지 않는다면 이메일 인증시간을 바로 넣는다
            if (!$config['cf_use_email_certify'])
                $sql .= " , mb_email_certify = '" . G5_TIME_YMDHIS . "' ";

            sql_query($sql);

            // 회원가입 포인트 부여
            insert_point($mb_id, $config['cf_register_point'], '회원가입 축하', '@member', $mb_id, '회원가입');

            // 추천인에게 포인트 부여
            if ($config['cf_use_recommend'] && $mb_recommend)
                insert_point($mb_recommend, $config['cf_recommend_point'], $mb_id . '의 추천인', '@member', $mb_recommend, $mb_id . ' 추천');

            // 회원님께 메일 발송
            if ($config['cf_email_mb_member']) {
                $subject = '[' . $config['cf_title'] . '] 회원가입을 축하드립니다.';

                $mb_md5 = md5($mb_id . $mb_email . G5_TIME_YMDHIS);
                $certify_href = G5_BBS_URL . '/email_certify.php?mb_id=' . $mb_id . '&amp;mb_md5=' . $mb_md5;

                ob_start();
                include_once(G5_BBS_PATH . '/register_form_update_mail1.php');
                $content = ob_get_contents();
                ob_end_clean();

                mailer($config['cf_title'], $config['cf_admin_email'], $mb_email, $subject, $content, 1);
            }

            // 최고관리자님께 메일 발송
            if ($config['cf_email_mb_super_admin']) {
                $subject = '[' . $config['cf_title'] . '] ' . $mb_nick . ' 님께서 회원으로 가입하셨습니다.';

                ob_start();
                include_once(G5_BBS_PATH . '/register_form_update_mail2.php');
                $content = ob_get_contents();
                ob_end_clean();

                mailer($mb_nick, $mb_email, $config['cf_admin_email'], $subject, $content, 1);
            }

            // 메일인증 사용하지 않는 경우에만 로그인
            if (!$config['cf_use_email_certify'])
                set_session('ss_mb_id', $mb_id);

            set_session('ss_mb_reg', $mb_id);

            sql_query("INSERT INTO gpf_social_users SET mb_id = '$mb_id', login_type = '{$su['type']}', social_id = '{$su['social_id']}', login_date = '" . G5_TIME_YMDHIS . "', reg_date = '" . G5_TIME_YMDHIS . "'");


        } else {    // not make gnu id

            // 그누보드 mb_id 를 20 으로 조정
            //$mb_id = "GSU_".$su['type'].'_'.str_replace("@", "_at_", $su['social_id']);
            $mb_id = "GSU_" . substr(md5($su['type'] . '_' . $su['social_id']), 0, 16);

            $mb_homepage = $su['homepage'];
            $mb_password = md5($mb_id . '_' . G5_TIME_YMDHIS);

            $mb_name = escape_trim($_POST['mb_name']);
            $mb_email = escape_trim($_POST['mb_email']);
            $mb_nick = $mb_name;

            if ($msg = empty_mb_nick($mb_nick)) alert($msg, "", true, true);
            if ($msg = empty_mb_email($mb_email)) alert($msg, "", true, true);
            if ($msg = reserve_mb_nick($mb_nick)) alert($msg, "", true, true);
            if ($msg = valid_mb_name($mb_name)) alert($msg, "", true, true);
            if ($msg = valid_mb_nick($mb_nick)) alert($msg, "", true, true);
            if ($msg = valid_mb_email($mb_email)) alert($msg, "", true, true);
            if ($msg = prohibit_mb_email($mb_email)) alert($msg, "", true, true);
            if ($msg = exist_mb_id($mb_id)) alert($msg);
            if ($msg = exist_mb_nick($mb_nick, $mb_id)) alert($msg, "", true, true);
            if ($msg = exist_mb_email($mb_email, $mb_id)) alert($msg, "", true, true);

            $sql = " insert into {$g5['member_table']}
						set mb_id = '$mb_id',
							mb_password = '" . sql_password($mb_password) . "',
							mb_name = '$mb_name',
							mb_nick = '$mb_nick',
							mb_nick_date = '" . G5_TIME_YMD . "',
							mb_email = '$mb_email',
							mb_homepage = '$mb_homepage',
							mb_today_login = '" . G5_TIME_YMDHIS . "',
							mb_datetime = '" . G5_TIME_YMDHIS . "',
							mb_ip = '$_SERVER[REMOTE_ADDR]',
							mb_level = '$config[cf_register_level]',
							mb_login_ip = '$_SERVER[REMOTE_ADDR]'
							";

            // 이메일 인증을 사용하지 않는다면 이메일 인증시간을 바로 넣는다
            if (!$config['cf_use_email_certify'])
                $sql .= " , mb_email_certify = '" . G5_TIME_YMDHIS . "' ";

            sql_query($sql);

            // 회원가입 포인트 부여
            insert_point($mb_id, $config['cf_register_point'], '회원가입 축하', '@member', $mb_id, '회원가입');

            // 추천인에게 포인트 부여
            if ($config['cf_use_recommend'] && $mb_recommend)
                insert_point($mb_recommend, $config['cf_recommend_point'], $mb_id . '의 추천인', '@member', $mb_recommend, $mb_id . ' 추천');

            // 회원님께 메일 발송
            if ($config['cf_email_mb_member']) {
                $subject = '[' . $config['cf_title'] . '] 회원가입을 축하드립니다.';

                $mb_md5 = md5($mb_id . $mb_email . G5_TIME_YMDHIS);
                $certify_href = G5_BBS_URL . '/email_certify.php?mb_id=' . $mb_id . '&amp;mb_md5=' . $mb_md5;

                ob_start();
                include_once(G5_BBS_PATH . '/register_form_update_mail1.php');
                $content = ob_get_contents();
                ob_end_clean();

                mailer($config['cf_title'], $config['cf_admin_email'], $mb_email, $subject, $content, 1);
            }

            // 최고관리자님께 메일 발송
            if ($config['cf_email_mb_super_admin']) {
                $subject = '[' . $config['cf_title'] . '] ' . $mb_nick . ' 님께서 회원으로 가입하셨습니다.';

                ob_start();
                include_once(G5_BBS_PATH . '/register_form_update_mail2.php');
                $content = ob_get_contents();
                ob_end_clean();

                mailer($mb_nick, $mb_email, $config['cf_admin_email'], $subject, $content, 1);
            }

            // 메일인증 사용하지 않는 경우에만 로그인
            if (!$config['cf_use_email_certify'])
                set_session('ss_mb_id', $mb_id);

            set_session('ss_mb_reg', $mb_id);

            sql_query("INSERT INTO gpf_social_users SET mb_id = '$mb_id', login_type = '{$su['type']}', social_id = '{$su['social_id']}', login_date = '" . G5_TIME_YMDHIS . "', reg_date = '" . G5_TIME_YMDHIS . "'");
        }

        //goto_url($this->getRedirectUrl());
        goto_url('/');
    }


    /**
     * logout_proc
     *
     * 로그아웃
     *
     * @access public
     * @return void
     */
    function logout_proc()
    {
        extract($GLOBALS);
        include_once G5_BBS_PATH . "/logout.php";
        goto_url($this->getRedirectUrl());
    }

    /**
     * logout_social
     *
     * 소셜 세션 삭제
     *
     * @access public
     * @return void
     */
    function logout_social()
    {
        set_session('fb_' . $this->plugin_config['fb_app_id'] . '_code', false);
        set_session('fb_' . $this->plugin_config['fb_app_id'] . '_access_token', false);
        set_session('fb_' . $this->plugin_config['fb_app_id'] . '_state', false);
        set_session('fb_' . $this->plugin_config['fb_app_id'] . '_user_id', false);
        set_session('sses_social_user', false);
        set_session('sses_social_redirect', false);
    }

    /**
     * px_disconnect_social
     *
     * 소셜 로그인 연결 해지
     *
     * @access public
     * @return void
     */
    function px_disconnect_social()
    {
        global $member, $url;
        if (!$member['mb_id']) alert('로그인 후 사용하세요');
        if ('GSU_' == substr($member['mb_id'], 0, 4)) {
            alert('소셜 로그인으로만 사용중인 계정은 연결을 해지할 수 없습니다. 관리자에게 문의하세요');
        }
        sql_query("DELETE FROM gpf_social_users WHERE mb_id = '{$member['mb_id']}'");
        alert('소셜 연결이 해지되었습니다.', $url);
    }

    /**
     * getRedirectUrl
     *
     * 리다이렉션 URL
     *
     * @access public
     * @return string 가야할주소
     */
    function getRedirectUrl()
    {
        $red = get_session('sses_social_redirect');
        if ($_SERVER['REQUEST_URI'] == $red) $red = '/';
        return ($red ? $red : '/');
    }

    /**
     * getSocialUser
     *
     * 소셜 사용자 반환 by id
     *
     * @param mixed $type
     * @param mixed $id
     * @access public
     * @return void
     */
    function getSocialUser($type, $id)
    {
        return sql_fetch("SELECT * FROM gpf_social_users WHERE login_type = '$type' AND social_id = '$id'");
    }

    /**
     * getSocialUserByMbId
     *
     * 소셜 사용자 반환 by mb_id
     *
     * @param mixed $mb_id
     * @param string $type
     * @access public
     * @return void
     */
    function getSocialUserByMbId($mb_id, $type = '')
    {
        if ($type) $sql_add = " AND login_type = '$type' ";
        return sql_fetch("SELECT * FROM gpf_social_users WHERE mb_id = '$mb_id' $sql_add ");
    }

    /**
     * plugin_install
     *
     * @access public
     * @return void
     */
    function plugin_install()
    {
        global $id;
        if ($this->id != $id) return;

        $install_script = <<<EOF
CREATE TABLE IF NOT EXISTS `gpf_social_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mb_id` varchar(20) DEFAULT NULL,
  `login_type` set('GG','TW','FB') NOT NULL,
  `social_id` varchar(255) DEFAULT NULL,
  `login_date` timestamp NULL DEFAULT NULL,
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM ;
EOF;
        sql_query($install_script);
        goto_url(gp_url('plugins.php'), GP_SCOPE_SITE);
    }

    /**
     * plugin_uninstall
     *
     * @access public
     * @return void
     */
    function plugin_uninstall()
    {
        global $id;
        if ($this->id != $id) return;

        sql_query("DROP TABLE gpf_social_users", false);
        gp_deactivate_plugin($this->id, GP_SCOPE_SITE);
        goto_url(gp_url('plugins.php'), GP_SCOPE_SITE);
    }

    /**
     * plugin_setting
     *
     * @param mixed $gpa_settings
     * @access public
     * @return void
     */
    function plugin_setting($gpa_settings)
    {
        array_push($gpa_settings, array('ID' => $this->id, 'title' => '소셜로그인', 'print_contents' => array($this, 'print_plugin_setting'), 'order' => 10));
        return $gpa_settings;
    }

    /**
     * print_plugin_setting
     *
     * @access public
     * @return void
     */
    function print_plugin_setting()
    {
        include_once $this->plugin_path . DS . 'config.php';
    }

    /**
     * plugin_save_setting
     *
     * @access public
     * @return void
     */
    function plugin_save_setting()
    {
        global $id;
        if ($this->id != $id) return;

        $this->_db_upgrade();

        gp_write_config(SOCIAL_LOGIN_CONFIG_FILE, gp_strip_slashes($_REQUEST['plugin_config']), GP_SCOPE_SITE);
        alert('소셜로그인 플러그인 설정 저장 완료');
    }

} // end of class


/**
 * Helpers
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 **/

function socialAccount($mb_id)
{
    $res = sql_query("SELECT * FROM gpf_social_users WHERE  mb_id = '$mb_id'");
    $accounts = array();
    while ($row = sql_fetch_array($res)) {
        array_push($accounts, $row);
    }
    return $accounts;
}

/**
 * socialConnectUrl
 *
 * 기존 사용자의 소셜 계정 연결을 위한 connect 페이지 주소
 *
 * @param string $url
 * @access public
 * @return void
 */
function socialConnectUrl($url = '')
{
    return GP_URL . '/do.php?id=' . gp_plugin_id(__FILE__) . '&act=sociallogin&s=connect&url=' . urlencode($url);
}

/**
 * socialDisConnectUrl
 *
 * 소셜 계정 연결 해지를 위한 주소
 *
 * @param string $url
 * @access public
 * @return void
 */
function socialDisConnectUrl($url = '')
{
    return GP_URL . '/do.php?id=' . gp_plugin_id(__FILE__) . '&act=sociallogin&s=disconnect_social&url=' . urlencode($url);
}

/**
 * socialLoginUrls
 *
 * 소셜 로그인 URL 들
 *
 * @param mixed $set_redirect
 * @param string $redirect_url
 * @access public
 * @return void
 */
function socialLoginUrls($set_redirect = true, $redirect_url = '')
{
    return _social_urls('login', $set_redirect, $redirect_url);
}

/**
 * socialConnectUrls
 *
 * 소셜 로그인 connect URL 들
 *
 * @param mixed $set_redirect
 * @param string $redirect_url
 * @access public
 * @return void
 */
function socialConnectUrls($set_redirect = true, $redirect_url = '')
{
    return _social_urls('connect', $set_redirect, $redirect_url);
}


/**
 * _social_urls
 *
 * 모드에 따른 소셜 로그인 주소 들
 *
 * @param mixed $url_type
 * @param mixed $set_redirect
 * @param string $redirect_url
 * @access protected
 * @return void
 */
function _social_urls($url_type, $set_redirect = true, $redirect_url = '')
{
    $plugin_id = gp_plugin_id(__FILE__);

    // FACEBOOK URL
    $fb_url = GP_URL . '/do.php?id=' . $plugin_id . '&act=sociallogin&s=' . $url_type . '_facebook';

    // TWITTER URL
    $tw_url = GP_URL . '/do.php?id=' . $plugin_id . '&act=sociallogin&s=' . $url_type . '_twitter';

    // GOOGLE URL
    $gg_url = GP_URL . '/do.php?id=' . $plugin_id . '&act=sociallogin&s=' . $url_type . '_google';

    // Naver URL
    $naver_url = GP_URL . '/do.php?id=' . $plugin_id . '&act=sociallogin&s=' . $url_type . '_naver';

    // 카카오톡 URL
    $kakao_url = GP_URL . '/do.php?id=' . $plugin_id . '&act=sociallogin&s=' . $url_type . '_kakao';

    if (!$redirect_url) $redirect_url = $_SERVER['REQUEST_URI'];
    if ($set_redirect === true) set_session('sses_social_redirect', $redirect_url);

    return array('facebook' => $fb_url, 'twitter' => $tw_url, 'google' => $gg_url, 'kakao' => $kakao_url, 'naver' => $naver_url);
}


