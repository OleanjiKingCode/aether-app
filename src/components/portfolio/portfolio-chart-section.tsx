import PortfolioAnalytics from "./portfolio-analytics";
import PortfolioPerformance from "./portfolio-performance";

const PortfolioChartSection = () => {
    return (
        <div className="flex gap-6 flex-col xl:flex-row">
            <PortfolioPerformance />
            <PortfolioAnalytics />
        </div>
    );
};

export default PortfolioChartSection;
