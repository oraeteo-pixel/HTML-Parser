<?php

/**
 * GPF 스킨 업그레이드 클래스
 *
 * 러블리어스 {@link http://lovelyus.net} 에서 스킨을 다운받아
 * 설치 및 업그레이드 하거나, 로컬 스킨을 삭제한다.
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
 * skinUpgrader 
 * 
 * @uses GPUpgrader
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
class UploadSkinUpgrader extends GPUpgrader {

    /**
     * 업로드된 스킨 아이디
     *
     * @var string
     * */
    var $uploaded_skin_id;

    /**
     * 업로드된 스킨 zip 파일 경로
     *
     * @var string
     * */
    var $uploaded_zip_file;

    /**
     * 스킨 업로드 경로
     *
     * @var string
     * */
    var $upload_path;

    /**
     * 스킨 유형
     *
     * @var string
     * */
    var $skin_type;

    /**
     * __construct 
     * 
     * @access protected
     * @return void
     */
    function __construct() {
        parent::__construct();
        $this->upload_path = GP_DATA_PATH . DS . 'uploaded_skin';
        @mkdir($this->upload_path, 0707);
        @chmod($this->upload_path, 0707);
        $this->uploaded_zip_file = $_REQUEST['uploaded_zip_file'];
        $this->uploaded_skin_id = $_REQUEST['uploaded_skin_id'];
        $this->skin_type = $_REQUEST['skin_type'];
    }

    /**
     * doit 
     *
     * <gp_admin>/updater.php 에서 호출하는 페이지로,
     * $md 값에 따라서 스킨 설치, 업그레이드, 삭제 기능을 수행
     * 
     * @param string $md 실행모드
     * @access public
     * @return void
     */
    function doit($md) {
        if ($md == 'upload')
            $this->uploadSkin();
        else if ($md == 'install')
            $this->installSkin();
        else
            alert('잘못된 연결 : ' . $md);
    }

    function uploadSkin() {
        $filename = basename($_FILES['skin_zip_file']['name']);

        if (pathinfo($filename, PATHINFO_EXTENSION) != 'zip')
            alert('ZIP 파일이 아닙니다.');

        $uploadfile = $this->upload_path . DS . $filename;

        if (!move_uploaded_file($_FILES['skin_zip_file']['tmp_name'], $uploadfile)) {
            alert('업로드에 실패하였습니다.');
            return;
        }

        $skin_id = $this->unzip($uploadfile, $this->upload_path);
        $skin_info = gp_skin_info($this->upload_path . DS . $skin_id . DS . 'readme.txt');

        if (!$skin_info) {
            unlink($uploadfile);
            $this->remove_dir($this->upload_path);
            alert("첨부파일에 스킨 정보 파일(readme.txt)이 존재하지 않거나 정보가 불충분합니니다.");
            return;
        }

        if ($this->skin_type != $skin_info['SkinType']) {
            unlink($uploadfile);
            $this->remove_dir($this->upload_path);
            alert("업로드된 스킨이 {$this->skin_type} 스킨이 아닙니다.");
            return;
        }

        $this->uploaded_zip_file = $uploadfile;
        $this->uploaded_skin_id = $skin_id;

        unset($_REQUEST['md']);
        goto_url('updater.php?md=install&uploaded_zip_file=' . basename($uploadfile) . '&uploaded_skin_id=' . $skin_id . '&' . http_build_query($_REQUEST));
    }

    /**
     * installskin 
     *
     * 스킨 설치
     *
     * 설치 프로세스
     *   1. 러블리어스에서 스킨 파일 다운로드 : <g5>/data/gp/downloaded_skin/<FILENAME> 에 저장(zip 파일)
     *   2. 스킨 압축 해제 : <g5>/data/gp/downloaded_skin/ 에 압축해제
     *   3. 스킨 복사 : <g5>/skin/<SKIN_TYPE>/<SKIN> 로 이동
     *   4. 다운로드 데이터 삭제
     * 
     * @access public
     * @return void
     */
    function installSkin() {
        $this->load_filemanager();

        if (!$this->uploaded_skin_id || !$this->uploaded_zip_file)
            alert('잘못된 연결');

        $this->uploaded_zip_file = $this->upload_path . DS . $this->uploaded_zip_file;

        $unzipped_dir = $this->upload_path . DS . $this->uploaded_skin_id;
        $target_dir = G5_SKIN_PATH . DS . $this->skin_type . DS . $this->uploaded_skin_id;

        if (!file_exists($unzipped_dir))
            alert('업로드된 스킨이 없습니다.');

        @chmod(G5_DATA_PATH, 0777);
        @chmod(GP_DATA_PATH, 0777);

        if (file_exists($target_dir))
            $this->uninstallSkin($this->uploaded_skin_id);

        if (!$this->fs->mkdir($this->_remote_path($target_dir))) {
            $this->_tail();
            alert('디렉토리 생성에 실패하였습니다 : ' . $target_dir, $this->backurl);
        }

        $this->flush('스킨을 스킨 디렉토리로 이동합니다....');
        $res = $this->copy_dir($unzipped_dir, $target_dir);
        if (!$res) {
            $this->error(' [ 실패 ]');
            unlink($this->uploaded_zip_file);
            $this->remove_dir($unzipped_dir);
            $this->_tail();
            return;
        }
        $this->remove_dir($unzipped_dir);
        $this->desc(' [ 완료 ] <br/>');

        unlink($this->uploaded_zip_file); // remove downloaded zip file
        $this->_tail();
    }

    /**
     * uninstallSkin 
     *
     * 스킨 삭제
     *
     * 삭제 프로세스
     *   1. 스킨 삭제 : <g5>/skin/<SKIN_TYPE>/<SKIN> 삭제
     * 
     * @access public
     * @return void
     */
    function uninstallSkin($skin_id) {
        $this->flush('기존에 설치된 스킨을 제거합니다....');
        $res = $this->fs->delete($this->_remote_path(G5_SKIN_PATH . DS . $this->skin_type . DS . $skin_id), true);
        if ($res)
            $this->desc(' [ 완료 ] <br/>');
        else {
            $this->error(' [ 실패 ] <br/>');
            $this->error('* 다음을 삭제할 수 없습니다 : ' . G5_SKIN_PATH . DS . $this->skin_type . DS . $skin_id . '<br/>');
        }
    }

    /**
     * _tail 
     *
     * 프로세스 완료 후, 하단 메시지 출력
     * 
     * @access protected
     * @return void
     */
    function _tail() {
        global $md, $skin, $skin_type;
        
        @chmod(G5_DATA_PATH, 0707);
        @chmod(GP_DATA_PATH, 0707);

        if (!$this->has_error)
            $this->flush('<br/>스킨 정보 페이지로 이동합니다... ');

        $msg = '<br/><a href="skin_install.php?skin_type=' . $this->skin_type . '&' . gp_uparam(TRUE) . '">스킨 설치 페이지로 이동</a> | <a href="skins.php?skin_type=' . $this->skin_type . '&' . gp_uparam(TRUE) . '">스킨 목록 페이지로 이동</a>';
        $this->flush($msg);

        if (!$this->has_error) {
            sleep(2);
            goto_url('skininfo.php?skin_type=' . $this->skin_type . '&skin=' . $this->skin . '&' . gp_uparam(TRUE));
        }
    }

}

?>
