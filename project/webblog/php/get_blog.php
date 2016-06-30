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
	$query = "SELECT title,content,date FROM blog_blog ORDER BY date DESC LIMIT 0,3";
	$flag = mysqli_query($con,$query) or die('SQL出错');
	$json = '';
	while( !!$row = mysqli_fetch_array($flag,MYSQLI_ASSOC) )
	{
		//转换为json格式
		$json .= json_encode( $row ).',';
	}
	sleep(3); //模拟网络延迟
	//去除最后一个逗号
	echo '['.substr($json,0,strlen($json)-1).']';
	mysqli_close($con);

?>