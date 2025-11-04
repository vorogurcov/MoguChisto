import { ErrorInfo, Component } from "react";

type Props = {
	children: React.ReactNode;
	defaultOpen?: boolean;
	onCatch?: (error: Error, errorInfo: ErrorInfo) => void;
};

export default class ErrorBoundary extends Component<Props> {
	state: { error?: Error; errorInfo?: ErrorInfo } = {};

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		if (process.env.NODE_ENV === "test") {
			throw error;
		}

		this.setState({ error, errorInfo });
		if (this.props.onCatch) {
			this.props.onCatch(error, errorInfo);
		}
	}

	render() {
		return !this.state.errorInfo ? (
			this.props.children
		) : (
			<div className="ErrorBoundary p-3">
				<h2 className="text-danger">Что-то пошло не так :(</h2>
				<details open={this.props.defaultOpen}>
					<small>
						<pre className="mt-2">
							{this.state.error?.toString()}
							{this.state.errorInfo.componentStack}
						</pre>
					</small>
				</details>
			</div>
		);
	}
}
