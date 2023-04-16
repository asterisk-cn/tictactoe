import classNames from "classnames";
import { useState } from "react";
import { animated, useSpring } from "react-spring";
import { DerivedGame } from "../types";
import "./Turn.css";

export default function Turn({ game }: { game: DerivedGame }): JSX.Element {
    let show = false;

    const [prevItems, setPrevItems] = useState(game);
    if (game !== prevItems && !game.status.isComplete) {
        setPrevItems(game);
        show = true;
    }

    const iconProps = useSpring({
        from: { transform: "scale(1)" },
        to: [
            {
                transform: show ? "scale(1.4)" : "scale(1)",
                config: { duration: 600 * 0.25 },
            },
            {
                transform: "scale(1)",
                config: { duration: 600 * 0.75 },
            },
        ],
        reset: show,
    });

    const textProps = useSpring({
        from: { opacity: 0, transform: "translateX(-20px)" },
        to: { opacity: 1, transform: "translateX(0)" },
        config: { duration: 600 },
        reset: show,
    });

    if (show) {
        show = false;
    }

    return (
        <div className={classNames("turn", game.currentPlayer.colorClass)}>
            <animated.div style={iconProps}>
                <i className={classNames("fa-solid", game.currentPlayer.iconClass)}></i>
            </animated.div>
            <animated.div style={textProps}>
                <p>{game.currentPlayer.name}, you're up!</p>
            </animated.div>
        </div>
    );
}
