import { forwardRef, useRef, useState } from "react";
import PageItem from "../../../../components/PageItem";
import Info from "../Title";
import classNames from "classnames";
import "./css.scss";
import { useSpring, animated } from "react-spring";

type QuestionT = {
	question: string;
	answer: string;
};

const questions: QuestionT[] = [
	{
		question: "Сколько клинеров приедет на уборку?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question: "Как долго будет идти уборка?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question: "Есть ли скидки за периодичный заказ уборки?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question: "Нужно ли находиться с клинерами в квартире во время уборки?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question: "Как выбрать периодичность уборки?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question: "Как понять, какая уборка мне подходит? Какую выбрать?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question: "Нужно ли предоставить клинеру свои тряпки, средства, швабру?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question: "Входит ли мытье окон в генеральную уборку?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
	{
		question:
			"Можно ли заказать химчистку или мойку окон отдельно? Или только вместе с уборкой?",
		answer:
			"Количество клинеров зависит от объёма и сложности работы. Например, на поддерживающую уборку 3х-комнатной квартиры приедет 1 клинер, а на генеральную уже 2 или 3, в зависимости от количества дополнительных услу",
	},
];

function Question({ question, answer }: QuestionT) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const wrapperStale = useSpring({
		from: {
			backgroundColor: "white",
		},
		to: {
			backgroundColor: isOpen ? "#292929" : "white",
		},
		config: { tension: 280, friction: 60 },
	});
	const answerStyle = useSpring({
		from: {
			backgroundColor: "white",
			opacity: 0,
			height: 0,
			marginTop: 0,
		},
		to: {
			backgroundColor: isOpen ? "#292929" : "white",
			opacity: isOpen ? 1 : 0,
			height: isOpen ? ref.current?.scrollHeight || 0 : 0,
			marginTop: isOpen ? 10 : 0,
		},
		config: { tension: 280, friction: 60 },
	});
	return (
		<animated.div
			style={wrapperStale}
			className={classNames("question", isOpen ? "open" : "")}
			onClick={() => setIsOpen((prev) => !prev)}
		>
			<div className="questionText">{question}</div>
			<animated.div
				ref={ref}
				className="answer"
				style={{ ...answerStyle, overflow: "hidden" }}
			>
				{answer}
			</animated.div>
		</animated.div>
	);
}

const FAQ = forwardRef<HTMLDivElement>((_, ref) => {
	return (
		<PageItem className="faq">
			<Info>
				<b ref={ref}>Часто задаваемые вопросы</b>
			</Info>
			<div className="ansWrapper">
				{questions.map((q, index) => (
					<Question key={index} {...q} />
				))}
			</div>
		</PageItem>
	);
});
FAQ.displayName = "FAQ";
export default FAQ;
