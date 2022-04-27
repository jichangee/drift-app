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
    },
    {
      title: "登录",
      icon: <UserOutlined className={styles.icon} />,
      href: "/signin",
    },
    {
      title: "注册",
      icon: <UserAddOutlined className={styles.icon} />,
      href: "/signup",
    },
  ];

  const authMenuList = [
    {
      title: "新建",
      icon: <PlusCircleOutlined className={styles.icon} />,
      href: "/new",
    },
    {
      title: "我的",
      icon: <UnorderedListOutlined className={styles.icon} />,
      href: "/mine",
    },
    {
      title: "设置",
      icon: <SettingOutlined className={styles.icon} />,
      href: "/setting",
    },
    {
      title: "登出",
      icon: <UserDeleteOutlined className={styles.icon} />,
      href: "/signout",
    },
  ];
  const { signedIn } = useSignedIn();
  const router = useRouter();
  const menuList = useMemo(() => {
    return signedIn ? authMenuList : defaultMenuList;
  }, [signedIn]);
  const menus = useMemo(() => {
    console.log("router.pathname", router.pathname);
    return menuList.map((item) => {
      const activityClassName =
        router.pathname === item.href ? styles.selected : "";
      return (
        <Link href={item.href} key={item.title}>
          <Button
            key={item.title}
            icon={item.icon}
            type="text"
            className={[activityClassName, styles.item]}
          >
            {item.title}
          </Button>
        </Link>
      );
    });
  }, [menuList, router.pathname]);
  return <div className={styles.header}>{menus}</div>;
}
