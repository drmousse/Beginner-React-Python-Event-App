// core imports
import { Card } from 'primereact/card';

// custom imports
import './tio-card.scss';

const TioCard = ({title, footer, header, subtitle, children}) => {

    return (
        <div className="card flex justify-content-center tio-card">
            <Card title={title} footer={footer} header={header} className="md:w-25rem authentication-card">
                <p className='mb-4'>
                    {subtitle}
                </p>
                {children}
            </Card>
        </div>
    );
};

export default TioCard;