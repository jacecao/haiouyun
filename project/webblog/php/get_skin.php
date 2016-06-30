<?php
	header('Content-Type:text/html;charset=utf-8');

	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_PWD','seagull');
	define('DB_NAME','blog');
	$con = mysqli_connect("localhost","root","seagull");
	if (!$con)
	  {
	  die('Could not connect: ' . mysql_error());
	  }
	mysqli_select_db($con,'blog');
	mysqli_query($con,"set names 'utf8'");
		if( $_POST['type'] == 'all' )
	{
		$query = "SELECT small_bg,big_bg,bg_color,bg_text FROM blog_skin";
		$flag = mysqli_query($con,$query) or die('SQL出错');
		$json = '';
		while( !!$row = mysqli_fetch_array($flag,MYSQLI_ASSOC) )
		{
			//转换为json格式
			$json .= json_encode( $row ).',';
		}
		sleep(1); //模拟网络延迟
		//去除最后一个逗号
		echo '['.substr($json,0,strlen($json)-1).']';
	}else if( $_POST['type'] == 'recall' ){
		$query = "SELECT big_bg,bg_color FROM blog_skin WHERE bg_flag = 1";
		$flag = mysqli_query($con,$query) or die('SQL出错');
		echo json_encode( mysqli_fetch_array($flag,MYSQLI_ASSOC) );
	}else if( $_POST['type'] == 'set' ){
		$query_1 = "UPDATE blog_skin SET bg_flag=0 WHERE bg_flag=1";
		$query_2 = "UPDATE blog_skin SET bg_flag=1 WHERE big_bg='{$_POST['big_bg']}'";
		mysqli_query($con,$query_1) or die('SQL出错');
		mysqli_query($con,$query_2) or die('SQL出错');
		echo mysqli_affected_rows( $con );
	}else if( $_POST['type'] == 'default' ){
		$query_3 = "UPDATE blog_skin SET bg_flag=0 WHERE bg_flag=1";
		mysqli_query($con,$query_3) or die('SQL出错');
		echo mysqli_affected_rows( $con );
	}
	mysqli_close($con);
?>