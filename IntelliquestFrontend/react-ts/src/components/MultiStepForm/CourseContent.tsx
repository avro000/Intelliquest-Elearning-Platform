import { useFieldArray } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";

interface Step2Props {
  form: UseFormReturn<any>;
}

export default function CourseContent({ form }: Step2Props) {
  const { control } = form;

  // Manage topics dynamically
  const { fields: topics, append: addTopic, remove: removeTopic } = useFieldArray({
    control,
    name: "topics",
  });


  return (
    <div>
      <div className="flex justify-center items-center mb-[24px]">
        <h1 className="font-semibold text-xl">Course Content</h1>
      </div>

      {topics.map((topic, topicIndex) => (
        <Card key={topic.id} className="p-5 mb-4 shadow-none">
          <div className="flex items-center justify-center">
            <h2 className="font-semibold text-lg py-2 px-6 rounded-lg border border-card-foreground border-dashed">Topic {topicIndex + 1}</h2>
          </div>
          <CardContent className="p-0">
            {/* Topic Name */}
            <FormField
              control={control}
              name={`topics.${topicIndex}.name`}
              render={({ field }) => (
                <FormItem className="gap-4">
                  <FormLabel>Topic Name</FormLabel>
                  <div className="flex items-center justify-between gap-4">
                    <FormControl>
                      <Input placeholder="Enter topic name" {...field} />
                    </FormControl>
                    <Button variant="destructive" size="icon" onClick={() => removeTopic(topicIndex)} disabled={topicIndex === 0}><Trash size={14} />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtopics Management */}
            <SubtopicsForm form={form} topicIndex={topicIndex} />
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={async () => {
          if (topics.length > 0) {
            const isValid = await form.trigger(`topics.${topics.length - 1}.name`);
            if (!isValid) return;
          }
          addTopic({ name: "", subtopics: [] });
        }}
        variant="secondary"
        className="shadow-none"
      >
        <Plus size={14} />
        Add Topic
      </Button>

    </div>
  );
}

// Subtopics Component
function SubtopicsForm({ form, topicIndex }: { form: UseFormReturn<any>; topicIndex: number }) {
  const { control } = form;

  // Manage subtopics dynamically
  const { fields: subtopics, append: addSubtopic, remove: removeSubtopic } = useFieldArray({
    control,
    name: `topics.${topicIndex}.subtopics`,
  });

  return (
    <div>
      {subtopics.map((subtopic, subtopicIndex) => (
        <Card key={subtopic.id} className="border-0 shadow-none pb-0">
          <CardContent className="px-0">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h4 className="font-semibold text-lg rounded-lg p-2 bg-sidebar">Subtopic {subtopicIndex + 1}</h4>
              <Button variant="destructive" size="icon" onClick={() => removeSubtopic(subtopicIndex)}><Trash size={14} />
              </Button>
            </div>
            {/* Subtopic Name */}
            <FormField
              control={control}
              name={`topics.${topicIndex}.subtopics.${subtopicIndex}.name`}
              render={({ field }) => (
                <FormItem className="gap-4">
                  <FormLabel>Subtopic Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subtopic name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Videos Management */}
            <VideosForm form={form} topicIndex={topicIndex} subtopicIndex={subtopicIndex} />
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={async () => {
          const isTopicValid = await form.trigger(`topics.${topicIndex}.name`);
          if (!isTopicValid) return;
          if (subtopics.length > 0) {
            const isSubtopicValid = await form.trigger(
              `topics.${topicIndex}.subtopics.${subtopics.length - 1}.name`
            );
            if (!isSubtopicValid) return;
          }
          addSubtopic({ name: "", videos: [] });
        }}
        variant="ghost"
        className="shadow-none mt-4"
      >
        <Plus size={14} />
        Add Subtopic
      </Button>
    </div>
  );
}

// Videos Component
function VideosForm({ form, topicIndex, subtopicIndex }: { form: UseFormReturn<any>; topicIndex: number; subtopicIndex: number }) {
  const { control } = form;

  // Manage videos dynamically
  const { fields: videos, append: addVideo, remove: removeVideo } = useFieldArray({
    control,
    name: `topics.${topicIndex}.subtopics.${subtopicIndex}.videos`,
  });

  return (
    <div>
      {videos.map((video, videoIndex) => (
        <Card key={video.id} className="border-0 shadow-none bg-sidebar px-6 mt-4">
          <CardContent className="px-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg">Video {videoIndex + 1}</h4>
              <Button variant="destructive" size="icon" onClick={() => removeVideo(videoIndex)}><Trash size={14} />
              </Button>
            </div>
            {/* Video Title */}
            <FormField
              control={control}
              name={`topics.${topicIndex}.subtopics.${subtopicIndex}.videos.${videoIndex}.title`}
              render={({ field }) => (
                <FormItem className="gap-4">
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Description */}
            <FormField
              control={control}
              name={`topics.${topicIndex}.subtopics.${subtopicIndex}.videos.${videoIndex}.description`}
              render={({ field }) => (
                <FormItem className="gap-4 mt-4">
                  <FormLabel>Video Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter video description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video URL */}
            <FormField
              control={control}
              name={`topics.${topicIndex}.subtopics.${subtopicIndex}.videos.${videoIndex}.url`}
              render={({ field }) => (
                <FormItem className="gap-4 mt-4">
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={async () => {
          const isSubtopicValid = await form.trigger(`topics.${topicIndex}.subtopics.${subtopicIndex}.name`);
          if (!isSubtopicValid) return;
          if (videos.length > 0) {
            const isLastVideoValid = await form.trigger([
              `topics.${topicIndex}.subtopics.${subtopicIndex}.videos.${videos.length - 1}.title`,
              `topics.${topicIndex}.subtopics.${subtopicIndex}.videos.${videos.length - 1}.description`,
              `topics.${topicIndex}.subtopics.${subtopicIndex}.videos.${videos.length - 1}.url`,
            ]);
            if (!isLastVideoValid) return;
          }
          addVideo({ title: "", description: "", url: "" });
        }}
        variant="ghost"
        className="shadow-none mt-4"
      >
        <Plus size={14} />
        Add Video
      </Button>
    </div>
  );
}
