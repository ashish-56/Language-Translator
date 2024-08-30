import { useState, useEffect } from 'react';
import countries from '../data';

const Translate = () => {
    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLang, setFromLang] = useState('en-GB');
    const [toLang, setToLang] = useState('hi-IN');

    useEffect(() => {
        const selectTags = document.querySelectorAll('select');
        selectTags.forEach((tag, id) => {
            tag.innerHTML = Object.entries(countries).map(([code, name]) =>
                `<option value="${code}" ${code === (id === 0 ? fromLang : toLang) ? 'selected' : ''}>${name}</option>`
            ).join('');
        });
    }, [fromLang, toLang]);

    const handleExchange = () => {
        setFromText(toText);
        setToText(fromText);
        setFromLang(toLang);
        setToLang(fromLang);
    };

    const handleTranslate = () => {
        if (!fromText.trim()) return;
        setToText('Translating...');
        const apiUrl = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLang}|${toLang}`;
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setToText(data.responseData.translatedText || 'Translation');
            });
    };

    const handleIconClick = (text, lang) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
    };

    const handleCopyClick = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="container">
            <div className="wrapper">
                <div className="text-input">
                    <textarea
                        spellCheck="false"
                        className="from-text"
                        placeholder="Enter text"
                        value={fromText}
                        onChange={(e) => setFromText(e.target.value)}
                    />
                    <textarea
                        spellCheck="false"
                        readOnly
                        className="to-text"
                        placeholder="Translation"
                        value={toText}
                    />
                </div>
                <ul className="controls">
                    <li className="row from">
                        <div className="icons">
                            <i
                                id="from"
                                className="fas fa-volume-up"
                                onClick={() => handleIconClick(fromText, fromLang)}
                            />
                            <i
                                id="from"
                                className="fas fa-copy"
                                onClick={() => handleCopyClick(fromText)}
                            />
                        </div>
                        <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}></select>
                    </li>
                    <li className="exchange">
                        <i className="fas fa-exchange-alt" onClick={handleExchange} />
                    </li>
                    <li className="row to">
                        <select value={toLang} onChange={(e) => setToLang(e.target.value)}></select>
                        <div className="icons">
                            <i
                                id="to"
                                className="fas fa-volume-up"
                                onClick={() => handleIconClick(toText, toLang)}
                            />
                            <i
                                id="to"
                                className="fas fa-copy"
                                onClick={() => handleCopyClick(toText)}
                            />
                        </div>
                    </li>
                </ul>
            </div>
            <button className="btn" onClick={handleTranslate}>Translate Text</button>
        </div>
    );
};

export default Translate;
