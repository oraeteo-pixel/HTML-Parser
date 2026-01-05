피카사
==========

Plugin Name: 피카사
Description: 피카사웹에 사진을 업로드할 수 있도록 합니다. 
Plugin URI: http://lovelyus.net/plugins/g5/picasa
Author: Chongmyung Park
Author URI: http://byfun.com
Version: 1.0.2
Platform: GPF5
Plugin Scope: BOARD
Required GPF Version: 5.0.0
Tested up to: 5.0.0
Plugin License: GPLv2 
Donation URI: http://lovelyus.net/donation
Tags: 피카사, 구글, 이미지

피카사 플러그인은 간단한 설정만으로 사진을 피카사웹에 업로드 할 수 있는 플러그인입니다. 

특징
------
  - 설정된 하나의 피카사 계정에 업로드 
  - 호스팅 디스크에 사진이 저장되지 않아 저용량 호스팅에서도 사용 가능 
  - 사진 업로드/수정/삭제 기능 (피카사웹에서도 수정/삭제됨) 
  - 스킨 수정 불필요 
  - 멀티 업로드
  - **게시판별로 다른 피카사웹 계정 사용 가능**

요구사항
---------
  - PHP **5.2** 또는 **5.3** 버전 
  - 그누보드5 최신버전 : [http://sir.co.kr](http://sir.co.kr "http://sir.co.kr") 
  - **GPF** 최신버전

설치
------
  - 그누보드 관리자 페이지의 '플러그인 > 플러그인 설치' 에서 원격으로 설치 또는 <g5>/gp/plugins 에 업로드
  - 플러그인 목록에서 picasa 플러그인 하단에 '설정' 링크를 클릭하고 다음의 정보를 입력한다. 
    - 이메일 : 구글 이메일 주소 
    - 패스워드 : 구글 패스워드 

일반 스킨에 피카사 기능 추가하는 방법
---------------------------------------

### list.skin.php

$list 변수의 각 항목에 videos 데이터가 자동으로 추가됩니다. 따라서 $list[$i]['videos'] 항목을 검사하면, 비디오가 첨부된 게시물인지 아닌지 확인 가능하며, 다음과 같이 활용할 수 있습니다.

[code php]
  ....
  if (isset($list[$i]['icon_new'])) echo $list[$i]['icon_new'];
  if (isset($list[$i]['icon_secret'])) echo $list[$i]['icon_secret'];
  // photos 필드를 검사하여 비디오 아이콘을 출력
  if (!empty($list[$i]['photos'])) echo '<img src="'.$board_skin_url.'/img/icon_picasa.png" style="margin-left:3px;width:13px;border:0;"/>';
  ....
[/code]

$list[$i]['photos'] 항목은 다음과 같은 배열 구조입니다.
[code php]
Array
(
    [0] => Array
    (
      [id] => 이미지인덱스 
      [mb_id] => 업로더 아이디
      [summary] => 이미지 요약
      [album_id] => 피카사웹 앨범 아이디
      [photo_id] => 피카사웹 포토 아이디
      [imgurl] => 이미지 URL
      [width] => 이미지 너비
      [height] => 이미지 높이
      [thumb1] => 작은 썸네일 주소
      [thumb1_width] => 작은 썸네일 너비
      [thumb1_height] => 작은 썸네일 높이
      [thumb2] => 중간 썸네일 주소
      [thumb2_width] => 중간 썸네일 너비
      [thumb2_height] => 중간 썸네일 높이
      [thumb3] => 큰 썸네일 주소
      [thumb3_width] => 큰 썸네일 너비
      [thumb3_height] => 큰 썸네일 높이
      [reg_date] => 등록일 (Y-m-d h:i:s)
  ),
  [1] => Array(...),
  [2] => Array(...),
  ...
)

[/code]

list.skin.php 를 웹진이나 겔러리 형식으로 만들고 싶을 경우에는, 위의 $list[$i]['photos'] 구조를 참고하여 $list[$i]['photos'][0]['imgurl'] 나 'thumb1'~'thumb3' 을 사용하시면 되겠습니다.
  
### view.skin.php
$view 에 photos 데이터가 자동으로 추가됩니다. 따라서 $view['photos'] 항목을 이용하여 비디오를 출력할 수 있습니다. 또는 다음과 같이 미리 정의된 액션을 이용해 출력할 수 있습니다.

[code php]
...
<div id="bo_v_con">
  /* 기본 스킨의 내용 출력부분 상단에 사진 출력 */
  <?php gp_do_action('picasa_view_print', 'thumb2', '.gpf_picasa_list{boarder:1px solid #eee;}'); ?>

  <?php echo get_view_thumbnail($view['content']); ?>
</div>
...
[/code]

'picasa_view_print' 액션은 <플러그인경로>/tpl/view.php 파일을 이용해 출력합니다.  사용자의 요구에 따라 출력을 조절할 수 있도록, 썸네일 크기와 css style 을 파라미터로 넘길 수 있습니다.  gp_do_action('picasa_view_print', 'A', 'B'); 에서 'A' 는 썸네일의 크기를 나타내며 'thumb1', 'thumb2', 'thumb3', 'origin' 중 하나를 입력하면 됩니다. 'B' 에는 출력폼에 들어가는 css style을 입력하면 됩니다. 위 예제에서는 사진목록을 감싸는 wrapper 에 border 를 입력합니다.

### write.skin.php

write.skin 에는 간단히 다음과 같은 코드를 추가하면 글 작성 폼이 나타납니다.

[code php]
...
<tr>
    <th scope="row"><label for="picasa">이미지</label></th>
    <td>
      <?php gp_do_action('picasa_print_form'); ?>
    </td>
</tr>
...
[/code]

업데이트
---------
  - 1.0.2 (2013-11-06)
    - 누락된 Tags.php 파일 추가
  - 1.0.1 (2013-11-01)
    - 뷰에서 이미지 출력시, 원본 출력 기능 추가
