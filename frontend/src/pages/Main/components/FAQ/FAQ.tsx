import { forwardRef, memo, useRef, useState } from "react";
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
			"От 2 до 6 часов. В тарифах Экспресс и Комфорт. Уборка в тарифе Элит может занять целый день",
	},
	{
		question: "Есть ли скидки за периодичный заказ уборки?",
		answer: "Да, при регулярных заказах предусмотрены скидки до 20%.",
	},
	{
		question: "Нужно ли находиться с клинерами в квартире во время уборки?",
		answer: "Необязательно, можно передать водителю ключи или код от замка. ",
	},
	{
		question: "Как выбрать периодичность уборки?",
		answer: `Экспресс: один – два раза в неделю
Комфорт: раз в месяц
Элит: каждый год
`,
	},
	{
		question: "Как понять, какая уборка мне подходит? Какую выбрать?",
		answer: `Экспресс - лёгкая уборка после будней.
Комфорт - полноценная уборка с деталями.
Элит - глубокая уборка всего помещения, включая труднодоступные зоны.
`,
	},
	{
		question: "Нужно ли предоставить клинеру свои тряпки, средства, швабру?",
		answer:
			"Нет, всё необходимое оборудование и химия будут доставлены на квартиру.",
	},
	{
		question: "Входит ли мытье окон в генеральную уборку?",
		answer: "Да. Внутри и снаружи. Все окна.",
	},
	{
		question:
			"Можно ли заказать химчистку или мойку окон отдельно? Или только вместе с уборкой?",
		answer:
			"Химчистку заказать можно. Но мытьё окон только в тарифах Комфорт и Элит.",
	},
];

const Question = memo(function ({
	question,
	answer,
	isOpen,
	handleOpen,
}: QuestionT & { isOpen: boolean; handleOpen: () => void }) {
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
			onClick={() => handleOpen()}
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
});
Question.displayName = "Question";

const FAQ = forwardRef<HTMLDivElement>((_, ref) => {
	const [indexOpened, setIndexOpened] = useState(-1);
	return (
		<PageItem className="faq">
			<Info>
				<b ref={ref}>Часто задаваемые вопросы</b>
			</Info>
			<div className="ansWrapper">
				{questions.map((q, index) => (
					<Question
						key={index}
						{...q}
						isOpen={index === indexOpened}
						handleOpen={() =>
							setIndexOpened(index === indexOpened ? -1 : index)
						}
					/>
				))}
			</div>
		</PageItem>
	);
});
FAQ.displayName = "FAQ";
export default FAQ;
