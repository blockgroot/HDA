const Loader = ({ classes, loaderText }: any) => {
	return (
		<div className={classes}>
			<img src={"/static/loader.gif"} alt="loader" className="loader" />
			{loaderText && loaderText !== "" ? (
				<p className="loaderText">{loaderText}</p>
			) : null}
		</div>
	);
};

export default Loader;
