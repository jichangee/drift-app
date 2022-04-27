import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import request from "@/utils/request";
import Link from "next/link";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./mine.module.css";
export default function Index() {
  const [list, setList] = useState([]);

  const fetchList = () => {
    request.get("/posts").then((res) => {
      setList(res.posts);
    });
  };
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div>
      <Input placeholder="搜索..." />
      <div className={styles.list}>
        {list.map((item) => (
          <div className={styles.item} key={item.id}>
            <div className={styles.titleCon}>
              <Link href={`/post/${item.id}`}>
                <h2 className={styles.title}>{item.title}</h2>
              </Link>
              <div className={styles.btns}>
                <Button icon={<DeleteOutlined />}></Button>
              </div>
            </div>
            <p className="desc">
              {item.description}
            </p>
            <div className={styles.tags}>
              <span className={[styles.tag, styles.private].join(" ")}>
                私有
              </span>
              <span className={styles.tag}>7分钟前</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
