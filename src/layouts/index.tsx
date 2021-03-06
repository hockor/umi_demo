import React from 'react';
// @ts-ignore
import styles from './index.css';
import Link from 'umi/link';



require('../assets/test')

const BasicLayout: React.FC = props => {
  const routes = [
    {
      name: 'GLSL基础',
      path: '/glsl',
    },
    {
      name: '纹理',
      path: '/texture',
    },
  ];

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        路由：
        <ul>
          { props.route && (props.route.routes as Array<any>).length  &&
          (props.route.routes as Array<any>).map(item=>(

            item.path &&
            <li key={item.path}>
            <Link to={item.path}>
              {item.path}
            </Link>
            </li>

          ))
          }

        </ul>
      </div>
      <div className={styles.right}>{props.children}</div>
    </div>
  );
};

export default BasicLayout;
