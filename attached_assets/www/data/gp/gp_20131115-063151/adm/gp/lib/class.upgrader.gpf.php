<?php

/**
 * GPF 코어 업그레이드 클래스
 *
 * 러블리어스 {@link http://lovelyus.net} 에서 GPF 버전을 검사하고, 
 * 최신버전이 있다면최신버전을 다운로드받아 업그레이드한다.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
if (!defined("_GNUBOARD_"))
    exit; // 개별 페이지 접근 불가 

include_once dirname(__FILE__) . DS . 'class.upgrader.php';

/**
 * GpfUpgrader 
 * 
 * @uses GPUpgrader
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
class GpfUpgrader extends GPUpgrader {

    /**
     * GPF 버전
     *
     * @var string
     * */
    var $gpf_version;

    /**
     * __construct 
     * 
     * @access protected
     * @return void
     */
    function __construct() {
        parent::__construct();
    }

    /**
     * doit 
     *
     * <gp_admin>/updater.php 에서 호출하는 페이지로,
     * $md 값에 따라서 gpf 버전 체크, 업그레이드의 기능을 수행
     * 
     * @param strig $md 
     * @access public
     * @return void
     */
    function doit($md) {
        if (!$md)
            $this->checkGPFVersion();
        else if ($md == 'do_upgrade')
            $this->upgradeGPF();
    }

    /**
     * checkGPFVersion 
     *
     * GPF 최신버전을 검사하고,
     * 업그레이드 페이지를 보이거나,
     * 최신버전임을 알린다.
     * 
     * @access public
     * @return void
     */
    function checkGPFVersion() {
        if ($this->hasLatestVersion())
            $this->shouldUpgrade();
        else
            $this->it_is_latest();
    }

    /**
     * hasLatestVersion 
     * 
     * 러블리어스로부터 GPF 버전정보를 가져온 후,
     * 현재 버전과 비교한ㄷ.
     *
     * @access public
     * @return boolean 최신버전이 존재하면 TRUE
     */
    function hasLatestVersion() {
        list($code, $header, $res) = gp_http_get(gp_api_url('gpf_version'));
        if ($code != 200) {
            $this->gpf_version = GP_VERSION;
            return false;
        }
        $this->gpf_version = $res;
        return version_compare($this->gpf_version, GP_VERSION) > 0;
    }

    /**
     * it_is_latest 
     * 
     * 현재버전이 최신일 경우 안내
     *
     * @access public
     * @return void
     */
    function it_is_latest() {
        echo '최신 버전입니다.';
    }

    /**
     * upgradeGPF 
     * 
     * GPF 업그레이드 프로세스
     *
     *   1. GPF 최신버전 다운로드 : <g5>/data/gp/downloaded/gpf.latest.zip 으로 저장
     *   2. 압축 해제 : <g5>/data/gp/downloaded/upgrade/ 에 압축해제
     *   3. 파일 검사 : 다운로드한 파일들에서 GPF의 몇가지 파일이 존재하는지 검사 
     *   4. 현재 버전 백업 : <g5>/data/gp_<현재시간>/ 에 백업
     *   5. 새버전의 GPF 를 설치 위치로 복사
     *      - <g5>/gp/
     *      - <g5>/extend/gp.extend.php
     *      - <g5>/skin/member/.gp
     *      - <g5>/skin/search/.gp
     *      - <g5>/adm/admin.menu717.php
     *      - <g5>/adm/img/menu717.gif
     *      - <g5>/adm/img/title_menu717.gif
     *      - <g5>/adm/gp/
     *   6. 백업한 이전버전의 플러그인들을 새로 설치된 GPF에 복사
     *      - <g5>/data/gp_<현재시간>/gp/plugins/*    -> <g5>/gp/plugins/
     *
     *  테스트 환경
     *  - Ubuntu APM (Apache 2.2.22, PHP 5.3.10, MySQL 5.5.32 ), vsFTPd
     *  - Windows7, APM (Apache 2.2.14, PHP 5.2.12, MySQL 5.1.39), FileZilla FTP Server
     *
     *  TODO
     *  - 에러 처리 : 프로세스중 에러 발생시 처리
     *  - 더 많은 환경에서의 테스트
     *    - 다양한 APM 버전, OS, FTP 버전 및 설정
     * 
     * @access public
     * @return void
     */
    function upgradeGPF() {
        extract($GLOBALS);
        @set_time_limit(300);
        if (!$this->hasLatestVersion())
            alert('최신 버전입니다.');
        $this->load_filemanager();
        $this->flush('GPF 코어를 다운로드합니다.... ');
        $url = gp_api_url('download_gpf');
        if (!$url)
            alert('API 키를 설정하신 후 사용하세요');
        $gpf_file = $this->down_path . DS . 'gpf.latest.zip';
        $upgrade_dir = $this->down_path . DS . 'upgrade';
        unlink($gpf_file);

        // download
        list($code, $header, $res, $downloaded) = gp_http_download($url, $gpf_file);
        if (!$downloaded) {
            $this->error(' [ 실패 - ' . $code . ' ] <br/>');
            $this->error('* ' . $res . '<br/>');
            return false;
        }
        $this->desc(' [ 완료 ] <br/>');

        // unpacking
        @chmod(G5_DATA_PATH, 0777);
        @chmod(GP_DATA_PATH, 0777);
        @chmod($this->down_path, 0777);

        @mkdir($upgrade_dir, 0777);
        @chmod($upgrade_dir, 0777);

        $this->flush('압축을 풉니다.... ');
        if (!($res = $this->unzip($gpf_file, $upgrade_dir))) {
            $this->error(' [ 실패 ] ');
            return false;
        } else {
            $this->desc(' [ 완료 ] <br/>');
        }

        $this->flush('파일을 검사합니다.... ');
        $checking = array('gp', 'adm', 'extend', 'skin', 'extend' . DS . 'gp.extend.php', 'gp' . DS . 'gnuboard.plugin.php', 'adm' . DS . 'gp' . DS . 'index.php');
        $isOk = true;
        foreach ($checking as $cf) {
            if (!file_exists($upgrade_dir . DS . $cf)) {
                $isOk = false;
                break;
            }
        }
        if (!$isOk) {
            $this->error(' [ 실패 ]<br/> ');
            $this->_restore_chmod();
            return false;
        }
        else
            $this->desc(' [ 완료 ] <br/>');

        $this->flush('현재 설치된 GPF를 백업합니다.... ');

        $backup_path = GP_DATA_PATH . DS . 'gp_' . date('Ymd-his');
        $res = $this->fs->mkdir($this->_remote_path($backup_path));
        $res &= $this->fs->mkdir($this->_remote_path($backup_path . DS . 'extend'));
        $res &= $this->fs->mkdir($this->_remote_path($backup_path . DS . 'adm'));
        $res &= $this->fs->mkdir($this->_remote_path($backup_path . DS . 'skin'));
        $res &= $this->fs->mkdir($this->_remote_path($backup_path . DS . 'skin' . DS . 'search'));
        $res &= $this->fs->mkdir($this->_remote_path($backup_path . DS . 'skin' . DS . 'member'));
        if (!$res) {
            $this->error(' [ 실패 ]<br/> ');
            $this->flush('* 백업 디렉토리 생성 실패');
            $this->_restore_chmod();
            return false;
        }

        // backup all gpf directories and files
        $this->fs->move($this->_remote_path(GP_PATH), $this->_remote_path($backup_path . DS . 'gp'));
        $this->fs->move($this->_remote_path(G5_PATH . DS . G5_EXTEND_DIR . DS . 'gp.extend.php'), $this->_remote_path($backup_path . DS . G5_EXTEND_DIR . DS . 'gp.extend.php'));
        $this->fs->move($this->_remote_path(G5_ADMIN_PATH . DS . 'admin.menu717.php'), $this->_remote_path($backup_path . DS . G5_ADMIN_DIR . DS . 'admin.menu717.php'));
        $this->fs->move($this->_remote_path(GP_ADMIN_PATH), $this->_remote_path($backup_path . DS . 'adm' . DS . 'gp'));
        $this->fs->move($this->_remote_path(G5_SKIN_PATH . DS . 'search' . DS . GP_INTERCEPT_SKIN), $this->_remote_path($backup_path . DS . G5_SKIN_DIR . DS . 'search' . DS . GP_INTERCEPT_SKIN));
        $this->fs->move($this->_remote_path(G5_SKIN_PATH . DS . 'member' . DS . GP_INTERCEPT_SKIN), $this->_remote_path($backup_path . DS . G5_SKIN_DIR . DS . 'member' . DS . GP_INTERCEPT_SKIN));

        if (file_exists($backup_path . DS . GP_DIR . DS . 'gnuboard.plugin.php')) {
            $this->desc(' [ 완료 ] <br/>');
            $this->flush('* 백업경로 : ' . $backup_path . '<br/>');
        } else {
            $this->error(' [ 실패 ]<br/> ');
            $this->_restore_chmod();
            return false;
        }

        $this->flush('새 버전을 설치합니다.... ');

        $res = $this->fs->mkdir($this->_remote_path(GP_PATH));
        $res &= $this->fs->mkdir($this->_remote_path(G5_ADMIN_PATH . DS . GP_DIR));
        $res &= $this->fs->mkdir($this->_remote_path(G5_SKIN_PATH . DS . 'search' . DS . GP_INTERCEPT_SKIN));
        $res &= $this->fs->mkdir($this->_remote_path(G5_SKIN_PATH . DS . 'member' . DS . GP_INTERCEPT_SKIN));

        if (!$res) {
            $this->error(' [ 실패 ]<br/> ');
            $this->flush('* 백업 디렉토리 생성 실패');
            $this->_restore_chmod();
            return false;
        }

        $this->copy_dir($upgrade_dir . DS . GP_DIR, GP_PATH);
        $this->fs->copy($this->_remote_path($upgrade_dir . DS . G5_EXTEND_DIR . DS . 'gp.extend.php'), $this->_remote_path(G5_PATH . DS . G5_EXTEND_DIR . DS . 'gp.extend.php'));
        $this->fs->copy($this->_remote_path($upgrade_dir . DS . G5_ADMIN_DIR . DS . 'admin.menu717.php'), $this->_remote_path(G5_ADMIN_PATH . DS . 'admin.menu717.php'));
        $this->copy_dir($upgrade_dir . DS . G5_ADMIN_DIR . DS . GP_DIR, G5_ADMIN_PATH . DS . GP_DIR);
        $this->copy_dir($upgrade_dir . DS . G5_SKIN_DIR . DS . 'search' . DS . GP_INTERCEPT_SKIN, G5_SKIN_PATH . DS . 'search' . DS . GP_INTERCEPT_SKIN);
        $this->copy_dir($upgrade_dir . DS . G5_SKIN_DIR . DS . 'member' . DS . GP_INTERCEPT_SKIN, G5_SKIN_PATH . DS . 'member' . DS . GP_INTERCEPT_SKIN);

        if (file_exists(GP_PATH . DS . 'gnuboard.plugin.php')) {
            $this->desc(' [ 완료 ] <br/>');
        } else {
            $this->error(' [ 실패 ]<br/> ');
            $this->error('* 백업본으로 복원하세요. 백업위치 : ' . $backup_path . '<br/>');
            $this->_restore_chmod();
            return false;
        }

        $this->flush('이전 버전의 플러그인들을 가져옵니다.... ');
        if (!$this->copy_dir($backup_path . DS . GP_DIR . DS . 'plugins', GP_PLUGIN_PATH, array(), $do_alert = false, $cont = false)) {
            $this->error(' [ 실패 ]<br/> ');
            $this->error('* 백업 폴더에서 플러그인을 복사해서 <g5>/gp/plugins 디렉토리에 옮기세요. 백업위치 : ' . $backup_path . '<br/>');
        } else {
            $this->desc(' [ 완료 ] <br/>');
        }

        $this->remove_dir($upgrade_dir);

        $this->_restore_chmod();

        $this->flush('<br/>업그레이드 내역 페이지로 이동합니다... ');
        $this->flush('<br/>시작페이지로 이동하시려면 이곳을 클릭하세요 : <a href="index.php?' . gp_uparam(TRUE) . '">시작 페이지로 이동</a>');
        sleep(2);
        goto_url('upgraded.php');
        //return true;
    }

    function _restore_chmod() {
        @chmod(G5_DATA_PATH, 0707);
        @chmod(GP_DATA_PATH, 0707);
        @chmod($this->down_path, 0707);
    }

    /**
     * shouldUpgrade 
     * 
     * FTP 설정이 없을 경우, FTP 정보 입력 페이지 보여줌
     * @access public
     * @return void
     */
    function shouldUpgrade() {
        global $hostname;
        if (!$hostname) {
            goto_url('updater.php?md=do_upgrade&' . http_build_query($_REQUEST));
            return false;
        }
        return true;
    }

}

?>
