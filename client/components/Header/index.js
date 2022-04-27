import React, { useMemo, useState } from "react";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeOutlined,
  UserOutlined,
  UserAddOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import useSignedIn from "@/lib/hooks/use-signed-in";
import styles from "./index.module.css";

export default function Index() {
  const defaultMenuList = [
    {
      title: "首页",
      icon: <HomeOutlined className={styles.icon} />,
      href: "/",
      value: 'home'
    },
    {
      title: "登录",
      icon: <UserOutlined className={styles.icon} />,
      href: "/signin",
      value: 'signin'
    },
    {
      title: "注册",
      icon: <UserAddOutlined className={styles.icon} />,
      href: "/signup",
      value: 'signup'
    },
  ];

  const authMenuList = [
    {
      title: "新建",
      icon: <PlusCircleOutlined className={styles.icon} />,
      href: "/new",
      value: 'new'
    },
    {
      title: "我的",
      icon: <UnorderedListOutlined className={styles.icon} />,
      href: "/mine",
      value: 'mine'
    },
    {
      title: "设置",
      icon: <SettingOutlined className={styles.icon} />,
      href: "/setting",
      value: 'setting'
    },
    {
      title: "登出",
      icon: <UserDeleteOutlined className={styles.icon} />,
      href: "/signout",
      value: 'signout'
    },
  ];
  const { signedIn } = useSignedIn();
  const router = useRouter();

  const menuList = useMemo(() => {
    if (signedIn === undefined) {
      return []
    }
    return signedIn ? authMenuList : defaultMenuList;
  }, [signedIn, authMenuList, defaultMenuList]);

  const menus = useMemo(() => {
    return menuList.map((item) => {
      const activeStyle = router.pathname === item.href ? styles.selected : ""
      return (
        <Link href={item.href} key={item.value}>
          <Button
            icon={item.icon}
            type="text"
            className={`${activeStyle} ${styles.item}`}
          >
            {item.title}
          </Button>
        </Link>
      );
    });
  }, [menuList, router.pathname]);
  return (
    <div className={styles.header}>{menus}</div>
  );
}
