import React, { FC, useState } from "react";
import styles from "./sidebar.module.scss";
import {
  Groups2Outlined,
  SettingsOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as ReactCarousel } from "react-responsive-carousel";
import GroupList from "../GroupList";
import UserList from "../UserList";
import Settings from "../Settings";

// Icon Component...
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

// Tabs...
const tabs = ["Groups", "Participants", "Settings"];

// Nav type...
type NavProps = {
  activeTab: number;
  onTabClicked: (tab: number) => void;
};

// Nav Header Component...
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

// Sidebar Component...
export const Sidebar = (props: { class: string }) => {
  // Default active tab...
  const [activeTab, setActiveTab] = useState<number>(0);

  // Handle tab clicked...
  const handleTabClicked = (index: number) => setActiveTab(index);

  // Rendering the JSX...
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
          {/* Tab1: Your Groups */}
          <div style={{ overflowY: "scroll" }}>
            <GroupList />
          </div>
          {/* Tab2: Users in current Group */}
          <div style={{ overflowY: "scroll" }}>
            <UserList />
          </div>
          {/* Tab3: Settings and other options */}
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
