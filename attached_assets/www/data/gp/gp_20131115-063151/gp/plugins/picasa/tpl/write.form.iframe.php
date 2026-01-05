<?php
if(!$_REQUEST['bo_table']) die('잘못된 연결');
include_once "_common.php";
include_once G5_PATH.DS.'head.sub.php';
?>
<h3>이미지 업로드</h3>
<div id="gpp_frame">
<form name="upfrm" action="<?php echo GP_URL;?>/do.php" method="post" enctype="multipart/form-data" id="upfrm">
    <input type="hidden" name="id" value="picasa"/> 
    <input type="hidden" name="act" value="picasa_do"/> 
    <input type="hidden" name="md" value="upload"/> 
    <input type="hidden" name="bo_table" value="<?php echo $bo_table;?>"/> 
    <input type="hidden" name="wr_id" value="<?php echo $wr_id; ?>"/> 
    <div class="gpp_left">
      <input type="file" name="photo"/> <br/>
      <input type="text" name="picture_title" size="30" class="gpp_txt" placeholder="요약을 입력하세요"/>
    </div>
    <div class="gpp_right">
      <input type="submit" name="btn_submit" value="업로드" class="gpp_btn"/>
    </div>
</form>
</div>
<style>
body, form{background-color:#fff;}
#gpp_frame{position:relative;border:2px solid #eee;padding:10px;}
.gpp_left{line-height:160%;}
.gpp_right{position:absolute;top:10px;right:10px;}
.gpp_txt {margin-top:5px;width:60%;height:22px;line-height:22px;border:1px solid #eaeaea }
.gpp_btn {background-color:#888;color:#fff;padding:5px 10px;border:0; }
</style>
<?
include_once G5_PATH.DS.'tail.sub.php';
?>
