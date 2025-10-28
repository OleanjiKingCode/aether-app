import PortfolioCardSection from "./portfolio-card-section";
import PortfolioChartSection from "./portfolio-chart-section";
import PortfolioHolders from "./portfolio-holders";

const PortfolioMain = () => {
  return (
    <div className="flex flex-col gap-6">
      <PortfolioCardSection />
      <PortfolioChartSection/>
      <PortfolioHolders />
    </div>
  );
};

export default PortfolioMain;