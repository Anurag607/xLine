import { FC, useState } from "react";
import styles from "../styles/sidebar.module.scss";
import {
  Groups2Outlined,
  SettingsOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import GroupList from "./groupList";
import UserList from "./userList";
import Settings from "./settings";

const Icon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "Groups":
      return <Groups2Outlined />;
    case "Participants":
      return <PeopleAltOutlined />;
    case "Settings":
      return <SettingsOutlined />;
    default:
      return <PeopleAltOutlined />;
  }
};

const tabs = ["Groups", "Participants", "Settings"];

type NavProps = {
  activeTab: number;
  onTabClicked: (tab: number) => void;
};

const Nav: FC<NavProps> = ({ activeTab, onTabClicked }) => (
  <header className={styles.tabs}>
    {tabs.map((tab: string, index) => (
      <button
        key={tab}
        type="button"
        onClick={() => onTabClicked(index)}
        className={activeTab === index ? styles.active : ""}
      >
        <Icon icon={tab} key={tab} />
      </button>
    ))}
    <div
      className={styles.underline}
      style={{
        translate: `${activeTab * 100}% 0`,
      }}
    />
  </header>
);

export const Sidebar = (props: { class: string }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabClicked = (index: number) => setActiveTab(index);

  return (
    <aside
      className={`${
        styles[`${props.class === "burger" ? "burgerSidebar" : "sidebar"}`]
      } burgerSidebar`}
    >
      <div>
        <Nav activeTab={activeTab} onTabClicked={handleTabClicked} />

        <ReactCarousel
          className={styles["react-carousel"]}
          showArrows={false}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          swipeable={true}
          emulateTouch={true}
          selectedItem={activeTab}
          onChange={handleTabClicked}
        >
          <div>
            <GroupList />
          </div>
          <div>
            <UserList />
          </div>
          <div>
            <form className={`${styles.darkMode}`}>
              <div className={styles["row"]}>
                <div className={styles["switch-label"]}>Dark Mode</div>
                <span className={styles["switch"]}>
                  <input
                    id={
                      props.class === "burger"
                        ? "bg-switch-round"
                        : "switch-round"
                    }
                    type="checkbox"
                  />
                  <label
                    htmlFor={
                      props.class === "burger"
                        ? "bg-switch-round"
                        : "switch-round"
                    }
                  ></label>
                </span>
              </div>
            </form>
            <Settings class={props.class} />
          </div>
        </ReactCarousel>
      </div>
    </aside>
  );
};
