import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: number) => void;
    currentValue?: number;
    title?: string;
}

export default function CalculatorModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    currentValue = 0,
    title 
}: CalculatorModalProps) {
    const { t } = useTranslation();
    const [display, setDisplay] = useState(currentValue.toString());
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);

    if (!isOpen) return null;

    const handleNumber = (num: string) => {
        // Limit display length to prevent overflow
        if (display.length >= 10) {
            return;
        }
        
        // Only allow integer numbers (no decimal points)
        if (num === '.') {
            return;
        }
        
        if (waitingForNewValue) {
            setDisplay(num);
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const handleOperation = (nextOperation: string) => {
        const inputValue = parseInt(display, 10);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);

            setDisplay(String(Math.floor(newValue)));
            setPreviousValue(Math.floor(newValue));
        }

        setWaitingForNewValue(true);
        setOperation(nextOperation);
    };

    const calculate = (firstValue: number, secondValue: number, operation: string): number => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return secondValue !== 0 ? Math.floor(firstValue / secondValue) : 0;
            default:
                return secondValue;
        }
    };

    const handleEquals = () => {
        const inputValue = parseInt(display, 10);

        if (previousValue !== null && operation) {
            const newValue = calculate(previousValue, inputValue, operation);
            setDisplay(String(Math.floor(newValue)));
            setPreviousValue(null);
            setOperation(null);
            setWaitingForNewValue(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(false);
    };

    const handleBackspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    const handleConfirm = () => {
        const value = parseInt(display, 10);
        if (!isNaN(value) && value >= 0 && value <= 999999) {
            onConfirm(value); // Only allow whole numbers for quantity
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-0 w-[32rem] max-w-[95vw] max-h-[90vh] overflow-hidden"
                onKeyDown={handleKeyPress}
                tabIndex={-1}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F58E18] purple-600 rounded-lg flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {title || t('common.calculator')}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Display */}
                    <div className="bg-gray-50 dark:bg-[#262626]/50 rounded-lg p-6">
                        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-800 rounded-lg p-6 text-right">
                            <div className="text-4xl font-mono text-gray-900 dark:text-gray-100 min-h-[3rem] flex items-center justify-end">
                                {display}
                            </div>
                            {display.length >= 10 && (
                                <div className="text-xs text-red-500 dark:text-red-400 mt-2 text-right">
                                    {t('common.maxLengthReached')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calculator Buttons */}
                    <div className="grid grid-cols-4 gap-3">
                        {/* Row 1 */}
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleClear}
                            className="col-span-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 h-14 text-lg font-semibold"
                        >
                            {t('common.buttons.clear')}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleBackspace}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            ⌫
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleOperation('÷')}
                            className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 h-14 text-lg font-semibold"
                        >
                            ÷
                        </Button>

                        {/* Row 2 */}
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('7')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            7
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('8')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            8
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('9')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            9
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleOperation('×')}
                            className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 h-14 text-lg font-semibold"
                        >
                            ×
                        </Button>

                        {/* Row 3 */}
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('4')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            4
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('5')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            5
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('6')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            6
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleOperation('-')}
                            className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 h-14 text-lg font-semibold"
                        >
                            -
                        </Button>

                        {/* Row 4 */}
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('1')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            1
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('2')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            2
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('3')}
                            className="bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            3
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleOperation('+')}
                            className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 h-14 text-lg font-semibold"
                        >
                            +
                        </Button>

                        {/* Row 5 */}
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleNumber('0')}
                            className="col-span-3 bg-gray-50 dark:bg-[#262626]/50 hover:bg-gray-100 dark:hover:bg-[#262626]/70 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-800 h-14 text-lg font-semibold"
                        >
                            0
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleEquals}
                            className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 h-14 text-lg font-semibold"
                        >
                            =
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onClose}
                        className="flex-1 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#262626]/50 h-12 text-base font-semibold"
                    >
                        {t('common.buttons.cancel')}
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleConfirm}
                        disabled={display.length >= 10 || parseInt(display, 10) > 999999 || parseInt(display, 10) < 0 || isNaN(parseInt(display, 10))}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('common.buttons.confirm')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
