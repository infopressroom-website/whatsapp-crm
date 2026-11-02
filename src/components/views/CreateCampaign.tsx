import { useState } from 'react';
import { Check, ChevronRight, Send, Users, FileText, Calendar, Clock, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { audienceOptions } from '@/data/mockData';
import { useTemplates, useCampaigns } from '@/lib/hooks';

interface CreateCampaignProps {
  onCancel: () => void;
}

const steps = ['Details', 'Template', 'Audience', 'Schedule'];

export default function CreateCampaign({ onCancel }: CreateCampaignProps) {
  const { list: templates } = useTemplates();
  const { createCampaign } = useCampaigns();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null);
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [done, setDone] = useState(false);

  const canNext = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return selectedTemplate !== null;
    if (step === 2) return selectedAudience !== null;
    if (step === 3) return scheduleType === 'now' || (date && time);
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      const audience = audienceOptions.find((a) => a.name === selectedAudience);
      createCampaign({
        name,
        template: selectedTemplate ?? '',
        audience: selectedAudience ?? '',
        recipients: audience?.count ?? 0,
        status: scheduleType === 'now' ? 'Sending' : 'Scheduled',
        sentAt: scheduleType === 'now' ? 'Just now' : `${date} ${time}`,
      });
      setDone(true);
    }
  };

  if (done) {
    const audience = audienceOptions.find((a) => a.name === selectedAudience);
    return (
      <div className="animate-fade-in-up flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-whatsapp-100 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-whatsapp-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Campaign Ready!</h2>
          <p className="text-sm text-slate-500 mt-2">
            {scheduleType === 'now'
              ? `"${name}" is being sent to ${audience?.count.toLocaleString()} recipients.`
              : `"${name}" is scheduled for ${date} at ${time}.`}
          </p>
          <div className="bg-slate-50 rounded-xl p-4 mt-5 text-left space-y-2">
            <Row label="Campaign" value={name} />
            <Row label="Template" value={selectedTemplate || '—'} />
            <Row label="Audience" value={`${selectedAudience} (${audience?.count})`} />
            <Row label="Schedule" value={scheduleType === 'now' ? 'Send immediately' : `${date} ${time}`} />
          </div>
          <button
            onClick={onCancel}
            className="mt-6 w-full bg-whatsapp-500 text-white font-semibold py-2.5 rounded-lg hover:bg-whatsapp-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tmpl = templates.find((t) => t.name === selectedTemplate);

  return (
    <div className="animate-fade-in-up">
      <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                    i < step
                      ? 'bg-whatsapp-500 text-white'
                      : i === step
                      ? 'bg-whatsapp-500 text-white ring-4 ring-whatsapp-50'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded ${i < step ? 'bg-whatsapp-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
        {/* Step 0: Details */}
        {step === 0 && (
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-5 h-5 text-whatsapp-500" />
              <h2 className="text-lg font-bold text-slate-800">Campaign Details</h2>
            </div>
            <p className="text-sm text-slate-400 mb-5">Give your campaign a name so you can find it later.</p>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Campaign Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diwali Mega Sale"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 transition"
            />
            <div className="mt-4 bg-blue-50 rounded-lg p-3 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">Tip: Pick a clear name like the offer or occasion. This is only seen by you, not your customers.</p>
            </div>
          </div>
        )}

        {/* Step 1: Template */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-whatsapp-500" />
              <h2 className="text-lg font-bold text-slate-800">Choose a Template</h2>
            </div>
            <p className="text-sm text-slate-400 mb-5">Select a pre-approved message template for this campaign.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {templates.filter((t) => t.status === 'Approved').map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.name)}
                  className={`text-left p-4 rounded-xl border-2 transition ${
                    selectedTemplate === t.name
                      ? 'border-whatsapp-500 bg-whatsapp-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{t.body}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Audience */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-whatsapp-500" />
              <h2 className="text-lg font-bold text-slate-800">Select Audience</h2>
            </div>
            <p className="text-sm text-slate-400 mb-5">Choose who will receive this campaign.</p>
            <div className="space-y-3">
              {audienceOptions.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setSelectedAudience(a.name)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${
                    selectedAudience === a.name
                      ? 'border-whatsapp-500 bg-whatsapp-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 text-sm">{a.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-bold text-whatsapp-600">{a.count.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">contacts</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-whatsapp-500" />
              <h2 className="text-lg font-bold text-slate-800">Schedule Campaign</h2>
            </div>
            <p className="text-sm text-slate-400 mb-5">Choose when to send your campaign.</p>
            <div className="space-y-3">
              <button
                onClick={() => setScheduleType('now')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                  scheduleType === 'now' ? 'border-whatsapp-500 bg-whatsapp-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Send className="w-5 h-5 text-whatsapp-600" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">Send Now</p>
                  <p className="text-xs text-slate-400">Start sending immediately</p>
                </div>
              </button>
              <button
                onClick={() => setScheduleType('later')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                  scheduleType === 'later' ? 'border-whatsapp-500 bg-whatsapp-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Clock className="w-5 h-5 text-whatsapp-600" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">Schedule for Later</p>
                  <p className="text-xs text-slate-400">Pick a date and time</p>
                </div>
              </button>
            </div>
            {scheduleType === 'later' && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50"
                  />
                </div>
              </div>
            )}

            {/* Preview */}
            {tmpl && (
              <div className="mt-5 bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Message Preview</p>
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-800">{tmpl.header}</p>
                  <p className="text-sm text-slate-600 mt-1">{tmpl.body}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer nav */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : onCancel())}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2"
          >
            {step > 0 ? 'Back' : 'Cancel'}
          </button>
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition ${
              canNext()
                ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {step === 3 ? (scheduleType === 'now' ? 'Send Campaign' : 'Schedule Campaign') : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}
